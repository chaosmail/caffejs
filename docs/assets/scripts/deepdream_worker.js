importScripts(
  '../libs/d3.min.js',
  '../dist/caffe.js'
);

var window = self;
var nj = NumJS;

// Let's create a GoogLeNet model from Caffe
var model = new Net.CaffeModel(
  '../models/bvlc_googlenet/caffejs_deepdream.prototxt',
  '../models/bvlc_googlenet/weights/'
);

// the mean value can be found in train_val.prototxt
var mean = [104.0, 116.0, 122.0];

model.load().then(function(d){
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
  dst.out_act.dw.set(dst.out_act.w);
}

function make_step(net, in_data, params) {
  params = params || {};
  var step_size = params.step_size || 1.5;
  var jitter = params.jitter || 32;
  var clip_data = params.clip_data === undefined ? true : clip_data;
  var end = params.end || 'inception_4c/output';
  var objective = params.objective || objective_L2;

  var src = net.getLayer('data');
  var dst = net.getLayer(end);

  var ox = nj.randi(-jitter, jitter+1);
  var oy = nj.randi(-jitter, jitter+1);

  // apply jitter shift
  in_data = in_data.roll(ox, oy);
  
  net.forward(in_data, {end: end})
  objective(dst)  // specify the optimization objective
  net.backward(undefined, {start: end})

  var out_data = src.out_act;
  var diff = out_data.dw;
  
  var mean_diff = 0.0;
  for (var i=0,len=diff.length;i<len;i++){
    mean_diff += Math.abs(diff[i]);
  }
  mean_diff /= diff.length;

  // apply normalized ascent step to the input image
  out_data.w = nj.addScaled(out_data.w, diff, step_size / mean_diff);

  // unshift image
  out_data = out_data.roll(-ox, -oy);

  if (clip_data) {
    bias = mean;
    for (var d=0; d<out_data.depth; d++) {
      for (var x=0; x<out_data.sx; x++) {
        for (var y=0; y<out_data.sy; y++) {
          var dval = nj.clip(out_data.get(x, y, d), -bias[d], 255-bias[d]);
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
    vol.w = nj.add(vol.w, detail.w);
    
    // For now the model dimensions are fixed
    // so lets update them
    model.setInputDimensions(vol.sx, vol.sy);

    for (var j = 0; j < iter_n; j++) {
      vol = make_step(net, vol, {end: end});

      self.postMessage({
        name: 'dream-progress',
        output: vol.toJSON(),
        octave: octave,
        iteration: j,
      });
    }

    // extract details produced on the current octave
    detail = vol.clone()
    detail.w = nj.sub(detail.w, octave_base.w);
  }

  // returning the resulting image
  return vol;
}

self.onmessage = function(e){
  var vol = Net.Vol.fromJSON(e.data.input);
  var params = e.data.params;

  // Perform a deepdream
  vol = deepdream(model, vol, params);

  self.postMessage({
    name: 'dream-finished',
    output: vol.toJSON(),
  });
}