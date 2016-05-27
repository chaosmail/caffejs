importScripts(
  '../node_modules/d3/d3.min.js',
  '../node_modules/queue-async/build/d3-queue.min.js',
  '../node_modules/convnetjs/build/util.js',
  '../libs/convnet.js',
  '../scripts/utils.js',
  '../scripts/CaffeModel.js'
);

var window = self;

// Let's create a GoogLeNet model from Caffe
var model = new CaffeModel('../models/caffejs_deepdream');

// the mean value can be found in train_val.prototxt
var mean = [104, 117, 123];

model.on('loadWeights', function(){
  
  // Notify the main thread that the model is ready
  self.postMessage({
    name: 'model-loaded',
  });
});

/**
 * Deepdream JavaScript implementation (running as Web Worker)
 * @src https://github.com/google/deepdream/blob/master/dream.ipynb
 */

var objective_L2 = function(dst) {
  dst.cn.out_act.dw.set(dst.cn.out_act.w);
}

function make_step(net, in_data, params) {
  params = params || {};
  var step_size = params.step_size || 1.5;
  var jitter = params.jitter || 32
  var clip_data = params.clip_data === undefined ? true : clip_data;
  var end = params.end || 'inception_4c/output';
  var objective = params.objective || objective_L2;

  var src = net.getLayer('data');
  var dst = net.getLayer(end);

  var ox = convnetjs.randi(-jitter, jitter+1);
  var oy = convnetjs.randi(-jitter, jitter+1);

  // apply jitter shift
  in_data = in_data.roll(ox, oy);
  
  net.forward(in_data, {end: end})
  objective(dst)  // specify the optimization objective
  net.backward(undefined, {start: end})

  var out_data = src.cn.out_act;
  var diff = out_data.dw;
  
  var mean_diff = 0.0;
  for (var i=0,len=diff.length;i<len;i++){
    mean_diff += Math.abs(diff[i]);
  }
  mean_diff /= diff.length;

  // apply normalized ascent step to the input image
  out_data.w = convnetjs.addScaled(out_data.w, diff, step_size / mean_diff);

  // unshift image
  out_data = out_data.roll(-ox, -oy);

  if (clip_data) {
    bias = mean;
    for (var d=0; d<out_data.depth; d++) {
      for (var x=0; x<out_data.sx; x++) {
        for (var y=0; y<out_data.sy; y++) {
          var dval = convnetjs.clip(out_data.get(x, y, d), -bias[d], 255-bias[d]);
          out_data.set(x, y, d, dval);
        }
      }
    }
  }

  return out_data;
}

function deepdream(net, vol, params) {
  params = params || {};
  var iter_n = params.iter_n || 10;
  var octave_n = params.octave_n || 4;
  var octave_scale = params.octave_scale || 1.4;
  var end = params.end || 'inception_4c/output';

  // prepare base images for all octaves
  var octaves = [vol];
  for (var i = 0; i < octave_n; i++) {
    octaves.push(octaves[octaves.length-1].zoom(1.0/octave_scale, 1.0/octave_scale, 1));
  }

  // allocate image for network-produced details
  var detail = octaves[octaves.length-1].cloneAndZero();

  for (var i = octave_n; i >= 0; i--) {
    var octave = octave_n - i;
    var octave_base = octaves[i];
    var w = octave_base.sx;
    var h = octave_base.sy;

    if (octave > 0) {
      // upscale details from the previous octave
      var w1 = detail.sx;
      var h1 = detail.sy;
      detail = detail.zoom(w/w1, h/h1, 1);
    }

    // extract details produced on the current octave
    vol = octave_base.clone();
    vol.w = convnetjs.add(vol.w, detail.w);
    
    // For now the model dimensions are fixed
    // so lets update them
    model.setInputDims(vol.sx, vol.sy);

    for (var j = 0; j < iter_n; j++) {
      vol = make_step(net, vol, {end: end});

      self.postMessage({
        name: 'dream-progress',
        output: vol2rgb(vol, mean),
        width: vol.sx,
        height: vol.sy,
        octave: octave,
        iteration: j,
      });
    }

    // extract details produced on the current octave
    detail.w = convnetjs.sub(vol.clone().w, octave_base.w);
  }

  // returning the resulting image
  return vol;
}

self.onmessage = function(e){
  var img = e.data.input;
  var params = e.data.params;

  // Transform the image to BGR volume and subtract mean
  var vol = rgb2vol(img, mean);

  // Perform a deepdream
  vol = deepdream(model, vol, params);

  self.postMessage({
    name: 'dream-finished',
    output: vol2rgb(vol, mean),
  });
}
