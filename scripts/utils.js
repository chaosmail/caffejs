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

function updateImg(canv, data, w, h) {
  canv.width = w;
  canv.height = h;
  var ctx = canv.getContext('2d');
  var g = ctx.getImageData(0, 0, w, h);
  g.data.set(data);
  ctx.putImageData(g, 0, 0);
}

function loadImg(canv, src) {
  return new Promise(function(resolve, reject){
    var ctx = canv.getContext('2d');
    var img = new Image;
    img.onload = function(){
      canv.width = img.width;
      canv.height = img.height;
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, img.width, img.height);
      resolve(data);
    };
    img.src = src;
  });
}

function rgb2vol(img, mean){
  mean = mean || [0, 0, 0];
  var w = img.width;
  var h = img.height;
  var vol = new convnetjs.Vol(w, h, 3, 0.0);
  // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
  // hence we need to also convert to BGR order
  // Also mean should be provided in this format
  for (var y=0; y < h; y++){
    for (var x=0; x < w; x++){
      var pp = (y*w + x) * 4;
      vol.set(x, y, 2, img.data[pp + 0] - (mean[2] instanceof Array ? +mean[2][y*h + x] : +mean[2]));
      vol.set(x, y, 1, img.data[pp + 1] - (mean[1] instanceof Array ? +mean[1][y*h + x] : +mean[1]));
      vol.set(x, y, 0, img.data[pp + 2] - (mean[0] instanceof Array ? +mean[0][y*h + x] : +mean[0]));
    }
  }
  return vol;
}

function vol2rgb(vol, mean){
  mean = mean || [0, 0, 0];
  var w = vol.sx;
  var h = vol.sy;
  var n = w*h*4;
  var data = new Uint8ClampedArray(n);
  // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
  // hence we need to also convert them back to RGB
  for (var y=0; y < h; y++){
    for (var x=0; x < w; x++){
      var pp = (y*w + x) * 4;
      data[pp + 0] = vol.get(x, y, 2) + (mean[2] instanceof Array ? +mean[2][y*h + x] : +mean[2]);
      data[pp + 1] = vol.get(x, y, 1) + (mean[1] instanceof Array ? +mean[1][y*h + x] : +mean[1]);
      data[pp + 2] = vol.get(x, y, 0) + (mean[0] instanceof Array ? +mean[0][y*h + x] : +mean[0]);
      data[pp + 3] = 255;
    }
  }
  return data;
}