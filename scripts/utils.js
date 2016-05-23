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
      vol.set(x, y, 0, data.B[x*w + y] - mean.B);
      vol.set(x, y, 1, data.G[x*w + y] - mean.G);
      vol.set(x, y, 2, data.R[x*w + y] - mean.R);
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