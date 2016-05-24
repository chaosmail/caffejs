function prototxtToJson(raw, level) {
  level = level || 0;
  var json = {};
  var match;
  
  if (level == 0) {
    var regexVal = /(?:^|\n)(\w+):\s"*([\w/.]+)"*/gi;
    var regexObj = /(?:^|\n)(\w+)\s\{([\S\s]*?)\n\}/gi;
  }
  else {
    var indent = '(?:^|\\n)\\s{' + level + '}';
    var key = '(\\w+)';
    var regexVal = new RegExp(indent + key + '\\s*:\\s*"*([\\w/.]+)"*', "gi");
    var regexObj = new RegExp(indent + key + '\\s*\\{\\s*\\n([\\s\\S]*?)\\n\\s{' + level + '}\\}', "gi");
  }

  while (match = regexVal.exec(raw)) {
    var key = match[1];
    var value = match[2];
    if (json[key] !== undefined) {
      if (Array.isArray(json[key])) {
        json[key].push(value);
      }
      else {
        json[key] = [json[key]];
        json[key].push(value);
      }
    }
    else {
      json[match[1]] = value;
    }
  }

  while (match = regexObj.exec(raw)) {
    var key = match[1];
    var value = prototxtToJson(match[2], level + 2);

    if (json[key] !== undefined) {
      if (Array.isArray(json[key])) {
        json[key].push(value);
      }
      else {
        json[key] = [json[key]];
        json[key].push(value);
      }
    }
    else {
      json[key] = value;
    }
  }

  return json;
}

function rgb2vol(data, w, h, mean){
  mean = mean || {R:0,G:0,B:0};
  var vol = new convnetjs.Vol(w, h, 3, 0.0);
  // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
  // hence we need to also convert to BGR order
  for (var y=0; y < h; y++){
    for (var x=0; x < w; x++){
      vol.set(x, y, 0, data.B[y*h + x] - mean.B);
      vol.set(x, y, 1, data.G[y*h + x] - mean.G);
      vol.set(x, y, 2, data.R[y*h + x] - mean.R);
    }
  }

  return vol;
}

function argmax(arr){
  var _max = Number.NEGATIVE_INFINITY;
  var _index = 0;
  for (var i=0, len = arr.length; i < len; i++){
    if (arr[i] > _max) {
      _max = arr[i];
      _index = i;
    }
  }
  return _index;
}

function argmaxn(arr, n){
  n = n || 3;
  var len = arr.length;
  var indices = new Array(len);
  for (var i = 0; i < len; ++i) indices[i] = i;
  return indices.sort(function(a, b){
    return arr[b] - arr[a];
  }).slice(0, n);
}

function maxn(arr, n){
  n = n || 3;
  return arr.sort(function(a, b){
    return b - a;
  }).slice(0, n);
}

// src: http://stackoverflow.com/a/14760377/5200303
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

function visualize_layer(elem, layer, scale){
  scale = scale || 5;
  var filters = layer.cn.filters;

  for (var i=0,len=filters.length;i<len;i++){
    draw_activations(elem, filters[i], scale, undefined, layer.name);
  }
}

function visualize_activations(elem, model){
  model.layerIterator(function(layer){
    draw_activations(elem, layer.cn.out_act, undefined, undefined, layer.name);
  })
}

var maxmin = cnnutil.maxmin;
var f2t = cnnutil.f2t;  

// elt is the element to add all the canvas activation drawings into
// A is the Vol() to use
// scale is a multiplier to make the visualizations larger. Make higher for larger pictures
// if grads is true then gradients are used instead
var draw_activations = function(elt, A, scale, grads, label) {

  var s = scale || 2; // scale
  var draw_grads = false;
  if(typeof(grads) !== 'undefined') draw_grads = grads;

  // get max and min activation to scale the maps automatically
  var w = draw_grads ? A.dw : A.w;
  var mm = maxmin(w);

  var A_depth = A.depth;
  var A_sx = A.sx;
  var A_sy = A.sy;

  // create the canvas elements, draw and add to DOM
  for(var d=0;d<A_depth;d++) {

    var canv = document.createElement('canvas');
    canv.title = label + ' :: ' + d;
    canv.className = 'actmap';
    var W = A_sx * s;
    var H = A_sy * s;
    canv.width = W;
    canv.height = H;
    var ctx = canv.getContext('2d');
    var g = ctx.createImageData(W, H);

    for(var x=0;x<A_sx;x++) {
      for(var y=0;y<A_sy;y++) {
        if(draw_grads) {
          var dval = Math.floor((A.get_grad(x,y,d)-mm.minv)/mm.dv*255);
        } else {
          var dval = Math.floor((A.get(x,y,d)-mm.minv)/mm.dv*255);  
        }
        for(var dx=0;dx<s;dx++) {
          for(var dy=0;dy<s;dy++) {
            var pp = ((W * (y*s+dy)) + (dx + x*s)) * 4;
            for(var i=0;i<3;i++) { g.data[pp + i] = dval; } // rgb
            g.data[pp+3] = 255; // alpha channel
          }
        }
      }
    }
    ctx.putImageData(g, 0, 0);
    elt.appendChild(canv);
  }  
}

var draw_activations_COLOR = function(elt, A, scale, grads) {

  var s = scale || 2; // scale
  var draw_grads = false;
  if(typeof(grads) !== 'undefined') draw_grads = grads;

  // get max and min activation to scale the maps automatically
  var w = draw_grads ? A.dw : A.w;
  var mm = maxmin(w);

  var canv = document.createElement('canvas');
  canv.className = 'actmap';
  var W = A.sx * s;
  var H = A.sy * s;
  canv.width = W;
  canv.height = H;
  var ctx = canv.getContext('2d');
  var g = ctx.createImageData(W, H);
  for(var d=0;d<3;d++) {
    for(var x=0;x<A.sx;x++) {
      for(var y=0;y<A.sy;y++) {
        if(draw_grads) {
          var dval = Math.floor((A.get_grad(x,y,d)-mm.minv)/mm.dv*255);
        } else {
          var dval = Math.floor((A.get(x,y,d)-mm.minv)/mm.dv*255);  
        }
        for(var dx=0;dx<s;dx++) {
          for(var dy=0;dy<s;dy++) {
            var pp = ((W * (y*s+dy)) + (dx + x*s)) * 4;
            g.data[pp + d] = dval;
            if(d===0) g.data[pp+3] = 255; // alpha channel
          }
        }
      }
    }
  }
  ctx.putImageData(g, 0, 0);
  elt.appendChild(canv);
}