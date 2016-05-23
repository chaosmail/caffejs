var CaffeModel = (function(cn){

  function CaffeModel(path_){

    var self = this;
    this.name = "";
    this.path = path_;
    this.layers = [];
    this.edges = [];
    this.dispatch = d3.dispatch('loadModel', 'createModel', 'loadWeights');

    this.dispatch.on('loadModel', function(model){
      self.create(model);
    });

    this.dispatch.on('createModel', function(){
      self.loadWeights();
    });

    this.loadModel();
  }

  CaffeModel.prototype.on = function(event, callbackFn) {
    this.dispatch.on(event, callbackFn);
  }

  CaffeModel.prototype.layerMap = function() {
    return d3.map(this.layers, function(d){ return d.name; });
  }

  CaffeModel.prototype.createEdges = function() {
    var self = this;
    this.edges = [];
    this.layers
      .filter(function(d){
        return d.input !== undefined && d.input != d.output;
      })
      .forEach(function(layer, i){
        var from = layer.input;
        var to = layer.output;

        if (!Array.isArray(from)){ 
          self.edges.push({from: from, to: to});
        }
        else {
          from.forEach(function(d){
            self.edges.push({from: d, to: to});
          });
        }
      });

    // Handle ReLU layers, which are usually self-loops in caffe
    // do some performance reasons
    this.layers
      .filter(function(d){
        return d.input !== undefined && d.input == d.output;
      })
      .forEach(function(layer, i){
        var target = layer.input;

        self.edges.forEach(function(edge){
          if (edge.from == target) {
            edge.from = layer.name;
            self.edges.push({from: target, to: layer.name});
            return;
          }
        });
      });
  }

  CaffeModel.prototype.updateDims = function() {
    
    this.layerIterator(function(layer, i, prev){
      if (prev === undefined) return;

      var l = layer.cn;
      
      if (prev.length === 1) {
        prev = prev[0];
        layer.cn.in_sx = prev.cn.out_sx;
        layer.cn.in_sy = prev.cn.out_sy;
        layer.cn.in_depth = prev.cn.out_depth;
      }

      switch(layer.cn.layer_type){
        case 'conv':
          layer.cn.out_sx = Math.round((l.in_sx + l.pad * 2 - l.sx) / l.stride + 1);
          layer.cn.out_sy = Math.round((l.in_sy + l.pad * 2 - l.sy) / l.stride + 1);
          break;
        case 'pool':
          layer.cn.out_depth = l.in_depth;
          layer.cn.out_sx = Math.round((l.in_sx + l.pad * 2 - l.sx) / l.stride + 1);
          layer.cn.out_sy = Math.round((l.in_sy + l.pad * 2 - l.sy) / l.stride + 1);
          break;
        case 'fc':
          layer.cn.num_inputs = l.in_sx * l.in_sy * l.in_depth;
          break;
        case 'concat':
          // concatenation along num
          // (n_1 + n_2 + ... + n_K) * c_1 * h * w, and all input c_i should be the same.
          if (layer.cn.axis == 0) {
            layer.cn.in_sx = prev[0].cn.out_sx;
            layer.cn.in_sy = prev[0].cn.out_sy;
            layer.cn.in_depth = prev[0].cn.out_depth;
          }
          // concatenate along channels
          // n_1 * (c_1 + c_2 + ... + c_K) * h * w, and all input n_i should be the sam
          else {
            layer.cn.in_sx = prev[0].cn.out_sx;
            layer.cn.in_sy = prev[0].cn.out_sy;
            layer.cn.in_depth = d3.sum(prev, function(d) { return d.cn.out_depth });
          }

          layer.cn.out_sx = l.in_sx;
          layer.cn.out_sy = l.in_sy;
          layer.cn.out_depth = l.in_depth;
          // prev.forEach(function(d){
          //   console.log(d.cn);
          // });
          break;
        case 'softmax':
          layer.cn.num_inputs = l.in_sx * l.in_sy * l.in_depth;
          layer.cn.out_depth = layer.cn.num_inputs;
          break;
        default:
          layer.cn.out_sx = l.in_sx;
          layer.cn.out_sy = l.in_sy;
          layer.cn.out_depth = l.in_depth;
          break;
      }
    });
  }

  function caffeLayerToJs(layer, i) {
    switch (layer.type) {

      case 'Input':
        var p = layer.input_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.InputLayer({
            out_depth: +p.shape.dim[1], out_sx: +p.shape.dim[2], out_sy: +p.shape.dim[3]
          })
        };
      
      case 'Convolution':
        var p = layer.param;
        var cp = layer.convolution_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ConvLayer({
            sx: +cp.kernel_size,
            filters: +cp.num_output,
            pad: cp && cp.pad !== undefined ? +cp.pad : 0.0,
            stride: cp && cp.stride !== undefined ? +cp.stride : 1.0,
            l1_decay_mul: p & p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0,
            l2_decay_mul: p & p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0
          })
        };

      case 'LRN':
        var p = layer.lrn_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.LocalResponseNormalizationLayer({
            k: 1, n: +p.local_size, alpha: +p.alpha, beta: +p.beta
          })
        };

      case 'Dropout':
        var dp = layer.dropout_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.DropoutLayer({drop_prob: +dp.dropout_ratio})
        };

      case 'Concat':
        var cp = layer.concat_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ConcatLayer({axis: cp && cp.axis != undefined ? +cp.axis : 1})
        };

      case 'Pooling':
        var pp = layer.pooling_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.PoolLayer({
            sx: +pp.kernel_size,
            pad: pp && pp.pad !== undefined ? +pp.pad : 0.0,
            stride: pp && pp.stride !== undefined ? +pp.stride : 1.0,
          })
        };

      case 'InnerProduct':
        var pp = layer.inner_product_param;
        var p = layer.param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.FullyConnLayer({
            num_neurons: +pp.num_output,
            l1_decay_mul: p & p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0,
            l2_decay_mul: p & p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0
          })
        };

      case 'Softmax':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.SoftmaxLayer({})
        };

      case 'ReLU':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ReluLayer({})
        };

      case 'Sigmoid':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.SigmoidLayer({})
        };

      case 'Tanh':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.TanhLayer({})
        };

      default:
        console.error('Cannot parse layer ' + layer.type, layer);
        return;
    }
  }

  CaffeModel.prototype.create = function(json){
    this.name = json.name;
    this.layers = [];

    // Create Input layer manually
    if (json.input == 'data') {
      this.layers.push({name: 'data', cn: new cn.InputLayer({
          out_depth: +json.input_dim[1], out_sx: +json.input_dim[2], out_sy:+json.input_dim[3],
        })
      });
    }

    this.layers = this.layers.concat(
      json.layer
        .map(caffeLayerToJs)
        .filter(function(d){
          return d !== undefined;
        })
    );

    this.createEdges();
    this.updateDims();

    this.dispatch.createModel(this);
  }

  CaffeModel.prototype.loadWeights = function(cb){
    // Defer the loads
    var q = d3_queue.queue();
    var path_ = this.path; 
    
    // Load all separate weights for the layers
    this.layers
      .filter(function(d){
        return d.cn && (d.cn.layer_type == 'conv' || d.cn.layer_type == 'fc');
      })
      .forEach(function(layer){
         q.defer(function(callback){
            d3.json(path_ + '/weights/' + layer.name + '.json', function(err, weights){
              callback(err, {layer: layer.name, weights: weights});
            });
         });
      });

    q.await((function(err) {
      if (err) {
        console.error(err);
        return;
      }

      // Transform arguments into array
      var args = Array.prototype.slice.call(arguments, 1);
      var weightsMap = d3.map(args, function(d){
        return d.layer;
      });

      this.layers = this.layers.map(function(layer, i){
        if (layer.cn && (layer.cn.layer_type == 'conv' || layer.cn.layer_type == 'fc')){
          // Get the weights for this layer
          var weights = weightsMap.get(layer.name).weights;

          // Initialize Filters
          layer.cn.filters = [];
          for(var i=0;i<layer.cn.out_depth;i++) {
            layer.cn.filters.push(new convnetjs.Vol(layer.cn.sx || 1, layer.cn.sy || 1, layer.cn.in_depth));
          }

          // Initialize Biases
          layer.cn.biases = new convnetjs.Vol(1, 1, layer.cn.out_depth, 0);

          var n = layer.cn.sx * layer.cn.sy * layer.cn.in_depth;
          for(var i=0; i<layer.cn.out_depth; i++) {
            
            // Update Filters
            for(var j=0;j<n;j++) {
              layer.cn.filters[i].w[j] = weights.filter[i][j];
            }

            // Update Biases
            layer.cn.biases[i] = weights.bias[i];
          }
        }

        // console.log(layer);

        return layer;   
      });

      this.dispatch.loadWeights(this);
    }).bind(this));
  }

  CaffeModel.prototype.loadModel = function(){
    var self = this;
    d3.text(this.path + '/deploy.prototxt', function(prototxt){
      self.dispatch.loadModel(prototxtToJson(prototxt));
    });
  }

  CaffeModel.prototype.layerIterator = function(iteratorFn) {
    var max_iter = 1000000;
    var m = this.layerMap();
    var layer = m.get('data');
    
    var visited = d3.set();
    var edgesFrom = d3.map(
      d3.nest()
        .key(function(d){ return d.from; })
        .entries(this.edges),
      function(d){
        return d.key;
      });

    var edgesTo = d3.map(
      d3.nest()
        .key(function(d){ return d.to; })
        .entries(this.edges),
      function(d){
        return d.key;
      });

    var layerStack = [];
    var i = 0;
    layerStack.push(layer);

    while (layerStack.length) {
      // Avoid endless loops
      if (i >= max_iter) {
        console.error('Reached maximum number of iterations');
        return;
      }

      // Take a layer from the stack
      var layer = layerStack.pop();
      
      // Set the layer visited
      visited.add(layer.name);

      // Collect the previous Layers
      var prev = undefined;
      var edgesToLayer = edgesTo.get(layer.name);
      if (edgesToLayer) {
        prev = edgesToLayer.values.map(function(d){
          return m.get(d.from);
        });
      }

      // Call the iterator callback
      iteratorFn(layer, i, prev);
      
      i += 1;

      // Get all connections from this layer
      var edgesFromLayer = edgesFrom.get(layer.name);
      if (edgesFromLayer) {
        edgesFromLayer.values.forEach(function(d){
          if (!visited.has(d.to)) {
            // Add only if all previous edges have been
            // already visited
            var can_add = true;

            // Get all edges to this layer
            var edgesToChild = edgesTo.get(d.to);
            if (edgesToChild) {
              edgesToChild.values.forEach(function(d){
                if (!visited.has(d.from)) {
                  // There is still an unvisited connection
                  // which needs to be resolved first
                  can_add = false;
                }
              });
            }

            if (can_add) {
              // Add the layer to the stack
              layerStack.push(m.get(d.to));
            }
          }
        });
      }
    }
  }

  CaffeModel.prototype.debugStructure = function(){
    var numParams = 0;
    var f = d3.format('s')
    var f2 = d3.format(',d')
    var numLayers = 0;

    this.layerIterator(function(layer, i){
      var l = layer.cn;
      var str = "";
      str += l.layer_type.toUpperCase().paddingLeft("       ");
  
      str +=  "::" + l.out_sx + "x" + l.out_sy + "x" + l.out_depth;
      
      str += "::" + layer.name;


      if (l.layer_type == 'conv' || l.layer_type == 'fc') {

        var x = l.sx;
        var y = l.sy;
        var c = l.in_depth;

        if (l.layer_type == 'fc') {
          x = 1;
          y = 1;
        }

        var n = x*y*c;
        var b = l.out_depth;
        
        str += ': ';

        if (b) {
          str += b + "x";
        }

        str += c + "x" + x + "x" + y;

        if (l.layer_type == 'conv') {
          str += " (S" + l.stride + " P" + l.pad + ")";
        }

        if (b) {
          n = n*b + b;
          numParams += n;
          str += " => " + f2(n) + ' params';
        
        }
      }
      else if (l.layer_type == 'pool') {
        str += ": " + l.sx + "x" + l.sy + " (S" + l.stride + " P" + l.pad + ")";
      }

      numLayers = i + 1;
      console.log(str);
    });

    console.log('---')
    console.log('Total number of layers ' + f2(numLayers));
    console.log('Total number of params ' + f2(numParams) + ' (memory: ' + f(numParams*8) + 'b): ');
  }

  // forward prop the network. 
  // The trainer class passes is_training = true, but when this function is
  // called from outside (not from the trainer), it defaults to prediction mode
  CaffeModel.prototype.forward = function(V, is_training, debug) {
    if(is_training === undefined) {
      is_training = false;
    }
    var _start, _fstart;
    if (debug) {
      _start = performance.now();
    }
    var actHistory = d3.map();
    var act;
    this.layerIterator(function(layer, i, prev){  
      if (prev === undefined) {
        act = V;
      }
      else if (prev.length > 1) {
        act = prev.map(function(d){
          return actHistory.get(d.name);
        });
      }
      else {
        act = actHistory.get(prev[0].name);
      }
      if (debug) {
        _fstart = performance.now();
      }
      act = layer.cn.forward(act, is_training);  
      if (debug) {
        console.info(layer.cn.layer_type + '::' + layer.name + ' in ', performance.now() - _fstart);
      }    
      actHistory.set(layer.name, act);
    });

    if (debug) {
      console.info('Forward pass in ', performance.now() - _start)
    }

    return act;
  }

  return CaffeModel;
})(convnetjs);