var CaffeModel = (function(cn){

  function CaffeModel(path_, weights, csv){
    weights = weights !== undefined ? weights : true;
    csv = csv !== undefined ? csv : false;
    var self = this;
    this.name = "";
    this.path = path_;
    this.layers = [];
    this.edges = [];
    this.dispatch = d3.dispatch('loadModel', 'createModel', 'loadWeights');

    this.dispatch.on('loadModel.caffe', function(model){
      self.create(model);
    });

    this.dispatch.on('createModel.caffe', function(){
      if (weights) {
        if (csv) {
          self.loadWeightsCsv();
        }
        else {
          self.loadWeights();
        }
      }
    });

    this.loadModel();
  }

  CaffeModel.prototype.on = function(event, callbackFn) {
    this.dispatch.on(event, callbackFn);
  }

  CaffeModel.prototype.layerMap = function() {
    return d3.map(this.layers, function(d){ return d.name; });
  }

  CaffeModel.prototype.getLayer = function(layer_name) {
    var layerMap = this.layerMap();
    return layerMap.get(layer_name);
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

  CaffeModel.prototype.setInputDims = function(width, height){
    this.layers[0].cn.in_sx = width;
    this.layers[0].cn.in_sy = height;
    this.layers[0].cn.out_sx = this.layers[0].cn.in_sx;
    this.layers[0].cn.out_sy = this.layers[0].cn.in_sy;
    this.updateDims();
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
    switch (layer.type.toLowerCase()) {

      case 'input':
        var p = layer.input_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.InputLayer({
            out_depth: +p.shape.dim[1], out_sx: +p.shape.dim[2], out_sy: +p.shape.dim[3]
          })
        };
      
      case 'convolution':
        var p = layer.param;
        var cp = layer.convolution_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ConvLayer({
            sx: +cp.kernel_size,
            filters: +cp.num_output,
            pad: cp && cp.pad !== undefined ? +cp.pad : 0.0,
            stride: cp && cp.stride !== undefined ? +cp.stride : 1.0,
            l1_decay_mul: p && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0,
            l2_decay_mul: p && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0
          })
        };

      case 'lrn':
        var p = layer.lrn_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.LocalResponseNormalizationLayer({
            k: 1,
            n: +p.local_size,
            alpha: +p.alpha,
            beta: +p.beta
          })
        };

      case 'dropout':
        var dp = layer.dropout_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.DropoutLayer({drop_prob: +dp.dropout_ratio})
        };

      case 'concat':
        var cp = layer.concat_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ConcatLayer({axis: cp && cp.axis != undefined ? +cp.axis : 1})
        };

      case 'pooling':
        var pp = layer.pooling_param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.PoolLayer({
            pool: pp.pool !== undefined ? pp.pool : 'MAX',
            sx: +pp.kernel_size,
            pad: pp && pp.pad !== undefined ? +pp.pad : 0.0,
            stride: pp && pp.stride !== undefined ? +pp.stride : 1.0,
          })
        };

      case 'inner_product':
      case 'innerproduct':
        var pp = layer.inner_product_param;
        var p = layer.param;
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.FullyConnLayer({
            num_neurons: +pp.num_output,
            l1_decay_mul: p && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0,
            l2_decay_mul: p && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0
          })
        };

      case 'softmax':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.SoftmaxLayer({})
        };

      case 'relu':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.ReluLayer({})
        };

      case 'sigmoid':
        return { 
          name: layer.name, output: layer.top, input: layer.bottom, id: i,
          cn: new cn.SigmoidLayer({})
        };

      case 'tanh':
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
          out_depth: +json.input_dim[1],
          out_sx: +json.input_dim[2],
          out_sy:+json.input_dim[3],
        })
      });
    }

    var layers = json.layer || json.layers;

    this.layers = this.layers.concat(
      layers.map(caffeLayerToJs)
        .filter(function(d){
          return d !== undefined;
        })
    );

    this.createEdges();
    this.updateDims();

    this.dispatch.createModel(this);
  }

  CaffeModel.prototype.loadWeightsCsv = function(cb){
    // Defer the loads
    var q = d3_queue.queue();
    var path_ = this.path; 
    var SEP = ',';
    
    // Load all separate weights for the layers
    this.layers
      .filter(function(d){
        return d.cn && (d.cn.layer_type == 'conv' || d.cn.layer_type == 'fc');
      })
      .forEach(function(layer){
         q.defer(function(callback){
            d3.text(path_ + '/weights/' + layer.name + '_filter.txt', function(err, weights){
              if (err) {
                console.error(err);
                return;
              }
              else {
                weights = weights.split('\n').map(function(d){
                  return d.split(SEP);
                });
                callback(err, {layer: layer.name, weights: weights, type: 'filter'});
              }
            });
         });
         q.defer(function(callback){
            d3.text(path_ + '/weights/' + layer.name + '_bias.txt', function(err, weights){
              if (err) {
                console.error(err);
                return;
              }
              else {
                weights = weights.split(SEP);
                callback(err, {layer: layer.name, weights: weights, type: 'bias'});
              }
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
      
      var weightsFilterMap = d3.map(args.filter(function(d){
        return d.type === 'filter';
      }), function(d){
        return d.layer;
      });

      var weightsBiasMap = d3.map(args.filter(function(d){
        return d.type === 'bias';
      }), function(d){
        return d.layer;
      });

      this.layers = this.layers.map(function(layer, i){
        if (layer.cn && (layer.cn.layer_type == 'conv' || layer.cn.layer_type == 'fc')){
          // Get the weights for this layer
          var weightsFilter = weightsFilterMap.get(layer.name).weights;
          var weightsBias = weightsBiasMap.get(layer.name).weights;

          // Initialize Filters
          layer.cn.filters = [];
          for(var i=0;i<layer.cn.out_depth;i++) {
            layer.cn.filters.push(new convnetjs.Vol(layer.cn.sx || 1, layer.cn.sy || 1, layer.cn.in_depth));
          }

          // Initialize Biases
          layer.cn.biases = new convnetjs.Vol(1, 1, layer.cn.out_depth, 0);

          var n = layer.cn.sx * layer.cn.sy * layer.cn.in_depth;
          
          console.log(layer.name);
          console.log(weightsFilter.length, weightsFilter[0].length)
          console.log(weightsBias.length, weightsBias[0].length)

          for(var i=0; i<layer.cn.out_depth; i++) {
            // Update Filters
            for(var j=0;j<n;j++) {
              layer.cn.filters[i].w[j] = +weightsFilter[i][j];
            }

            // Update Biases
            layer.cn.biases[i] = +weightsBias[i];
          }
        }
        return layer;   
      });

      this.dispatch.loadWeights(this);
    }).bind(this));
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

  /**
   * Traverses the network graph and calls iteratorFn on
   * each layer, automatically handles layer dependencies
   * @param  {LayerIteratorCallback} iteratorFn - Function called for every layer
   * @param  {Object} params - Parameters for the iterator
   * @param  {String} params.start - Layer name where the traversal should be started
   * @param  {String} params.end - Layer name where the traversal should be stopped
   * @param  {Boolean} params.reverse - Travers the graph backwards if set to true
   * @return undefined
   *
   * @example <caption>Forward Traversal</caption>
   * var model = new CaffeModel('models/bvlc_googlenet');
   *
   * model.layerIterator(function(layer, i, parents){
   *    // do something cool with layer
   *    console.log(layer.name);
   * });
   *
   * * @example <caption>Backward Traversal</caption>
   * var model = new CaffeModel('models/bvlc_googlenet');
   *
   * model.layerIterator(function(layer, i, parents){
   *    // do something cool with layer
   *    console.log(layer.name);
   * }, {
   *   reverse: true
   * });
   */
  CaffeModel.prototype.layerIterator = function(iteratorFn, params) {
    params = params || {};
    
    var layerMap = this.layerMap();
    var layerStack = [];
    var i = 0;

    // Store the visited nodes
    var visited = d3.set();

    // Forward traversal
    if (!params.reverse) {
      // Define the current layer
      var layer = params.start ? layerMap.get(params.start) : this.layers[0];
      var edges = this.edges;
    }
    // Backward traversal
    else {
      // Define the current layer
      var layer = params.start ? layerMap.get(params.start) : this.layers[this.layers.length - 1];
      var edges = this.edges.map(function(d){
        return {from: d.to, to: d.from};
      });
    }

    // Aggregate all edges by the from property
    // Reverse edge directions
    var edgesFrom = d3.map(
      d3.nest()
        .key(function(d){ return d.from; })
        .entries(edges),
      function(d){
        return d.key;
      });

    // Aggregate all edges by the to property
    // Reverse edge directions
    var edgesTo = d3.map(
      d3.nest()
        .key(function(d){ return d.to; })
        .entries(edges),
      function(d){
        return d.key;
      });

    // Start with the first layer
    layerStack.push(layer);

    while (layerStack.length) {
      // Take a layer from the stack
      var layer = layerStack.pop();
      
      // Set the layer visited
      visited.add(layer.name);

      // Collect the previous Layers
      var parentKeys = edgesTo.get(layer.name);
      var parents = parentKeys === undefined ? undefined
        : parentKeys.values.map(function(d){
          return layerMap.get(d.from);
        });

      // Call the iterator callback
      iteratorFn(layer, i++, parents);
      
      // Check if we reached the end layer
      if (params.end && layer.name === params.end) {
        break;
      }

      // Get all children for this layer
      var childrenKeys = edgesFrom.get(layer.name);
      if (childrenKeys) {
        childrenKeys.values
          .filter(function(d){
            // Only check adjacent nodes that have
            // not been visited yet
            return !visited.has(d.to);
          })
          .forEach(function(d){
            // Check if there are still any unvisited parents
            // of the next child which need to be visited first
            var parentKeysOfChild = edgesTo.get(d.to);
            var unvisitedParents = parentKeysOfChild === undefined ? []
              : parentKeysOfChild.values.filter(function(d){
                return !visited.has(d.from);
              });

            // All previous parents have been visited
            if (unvisitedParents.length === 0) {
              // Add the layer to the stack
              layerStack.push(layerMap.get(d.to));
            }
          });
      }
    }
  }

  /**
   * Called on every layer of the network graph
   * @callback LayerIteratorCallback
   * @param {Layer} layer - Current layer of the network
   * @param {Integer} i - Index of the layer in the traversal
   * @param {Layer[]} parents - Array of parent layers
   * @returns undefined
   */

  /**
   * Returns the number of weights and bias parameters of
   * the given layer
   * @param  {Object} layer - Current layer
   * @return {Number[]} [n_weights, n_bias]
   */
  CaffeModel.prototype.getNumParameters = function(layer){
    var l = layer.cn;
    
    switch(l.layer_type){
      case 'conv':
        return [l.in_depth * l.sx * l.sy * l.out_depth, l.out_depth];
      case 'fc':
        return [l.in_depth * l.in_sx * l.in_sy * l.out_depth, l.out_depth];
      default:
        return [0, 0];
    }
  }

  // This should be implemented for each layer
  CaffeModel.prototype.computeOutputShape = function(layer){
    var l = layer.cn; 

    switch(l.layer_type){
      case 'conv':
        return [
          l.out_depth,
          Math.ceil((l.in_sy + 2 * l.pad - l.sy + 1 + l.stride - 1) / l.stride),
          Math.ceil((l.in_sx + 2 * l.pad - l.sx + 1 + l.stride - 1) / l.stride),
        ]
      case 'pool':
        return [
          l.in_depth,
          Math.ceil((l.in_sy + 2 * l.pad - l.sy + 1 + l.stride - 1) / l.stride),
          Math.ceil((l.in_sx + 2 * l.pad - l.sx + 1 + l.stride - 1) / l.stride),
        ]
      case 'fc':
      case 'softmax':
        return [
          l.out_depth, 1, 1
        ];
      default:
        return [
          l.in_depth, l.in_sy, l.in_sx
        ];
    }
  }

  CaffeModel.prototype.getOutputShape = function(layer){
   var l = layer.cn;    
   return [l.out_depth, l.out_sy, l.out_sx]; 
  }

  CaffeModel.prototype.getLayerDescription = function(layer){
   var l = layer.cn;    
   var d = [l.layer_type.toUpperCase(), layer.name];

   switch (l.layer_type) {
    case 'conv':
      d.push([l.out_depth, l.sy, l.sx].join('x'));
      d.push('Stride ' + l.stride);
      d.push('Pad ' + l.pad);
      break;
    case 'pool':
      d.push(l.pool);
      d.push([l.sy, l.sx].join('x'));
      d.push('Stride ' + l.stride);
      d.push('Pad ' + l.pad);
      break;
   }

   return d;
  }

  CaffeModel.prototype.debugStructure = function(){
    var self = this;
    var numParams = 0;
    var f = d3.format('s')
    var f2 = d3.format(',d')
    var numLayers = 0;

    this.layerIterator(function(layer, i){
      var l = layer.cn;
      var numParamsPerLayer = convnetjs.sum(self.getNumParameters(layer));

      var str = "";
      str += self.getOutputShape(layer).join('x') + " :: ";
      str += self.getLayerDescription(layer).join(' ');

      if (numParamsPerLayer) {
        numParams += numParamsPerLayer;
        str += " => " + f2(numParamsPerLayer) + ' parameters';
      }

      numLayers = i + 1;
      console.log(str);
    });

    console.log('---')
    console.log('Total number of layers ' + f2(numLayers));
    console.log('Total number of params ' + f2(numParams) + ' (memory: ' + f(numParams*4) + 'b): ');
  }

  // forward prop the network. 
  // The trainer class passes is_training = true, but when this function is
  // called from outside (not from the trainer), it defaults to prediction mode
  CaffeModel.prototype.forward = function(V, is_training, params) {
    is_training = is_training === undefined ? false : true;
    params = params || {};
    var activationMap = d3.map();
    var currentActivation;
    this.layerIterator(function(layer, i, parents){  
      if (parents === undefined) {
        currentActivation = V;
      }
      else if (parents.length > 1) {
        currentActivation = parents.map(function(d){
          return activationMap.get(d.name);
        });
      }
      else {
        currentActivation = activationMap.get(parents[0].name);
      }
      currentActivation = layer.cn.forward(currentActivation, is_training);  
      activationMap.set(layer.name, currentActivation);
    }, params);

    return currentActivation;
  }

  // backprop: compute gradients wrt all parameters
  CaffeModel.prototype.backward = function(y, params) {
    params = params || {};
    params.reverse = true;

    var loss;

    this.layerIterator(function(layer, i, parents){  
      if (y !== undefined && i === 0) {
        // last layer assumed to be loss layer
        loss = layer.cn.backward(y);
      }
      else {
        // backprop to all other layers
        layer.cn.backward();
      }
    }, params);

    return loss;
  }

  return CaffeModel;
})(convnetjs);