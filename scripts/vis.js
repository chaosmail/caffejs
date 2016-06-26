
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

var draw_activations_COLOR = function(elt, A, scale, grads, label) {

  var s = scale || 2; // scale
  var draw_grads = false;
  if(typeof(grads) !== 'undefined') draw_grads = grads;

  // get max and min activation to scale the maps automatically
  var w = draw_grads ? A.dw : A.w;
  var mm = maxmin(w);

  var canv = document.createElement('canvas');
  canv.title = label;
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

function visualize_activations(selector, model){

  var scale = {
    224: 1,
    113: 1,
    56: 1,
    28: 1,
    14: 1,
    7: 2,
    1: 12
  };

  var $elem = d3.select(selector)
    .attr('class', 'net-network');

  model.layerIterator(function(layer){

    $elem.append('h3')
      .text("Layer type: " + layer.name);
    
    var $div = $elem.append('div')
      .attr('class', 'net-layer');

    var $info = $div.append('div')
      .attr('class', 'net-description');
    
    var $vis = $div.append('div')
      .attr('class', 'net-vis');

    var $weights = $vis.append('div')
      .attr('class', 'net-weights');

    var $activations = $vis.append('div')
      .attr('class', 'net-activations');
    $info.append('span')
      .text(layer.cn.layer_type);

    // if (layer.cn.layer_type === 'conv'){
    //   if (layer.cn.in_depth === 3) {
    //     for (var d=0; d<layer.cn.filters.length;d++){
    //       draw_activations_COLOR($weights[0][0], layer.cn.filters[d], scale[layer.cn.sx], undefined, layer.name + "::" + d);
    //     }
    //   }
    //   else {
    //     for (var d=0; d<layer.cn.filters.length;d++){
    //       draw_activations($weights[0][0], layer.cn.filters[d], scale[layer.cn.sx], undefined, layer.name + "::" + d);
    //     }
    //     $weights.append('br')
    //   }
    // }

    if (layer.name == 'data') {
      draw_activations_COLOR($activations[0][0], layer.cn.out_act, scale[layer.cn.out_act.sx], undefined, layer.name);
    }
    else {
      draw_activations($activations[0][0], layer.cn.out_act, scale[layer.cn.out_act.sx], undefined, layer.name);
    }
  })
}