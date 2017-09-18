import * as d3 from 'd3';

import PrototxtParser from '../Parser/PrototxtParser';
import Net from './Net';
import {ILayer} from './ILayer';
import * as Layers from './Layers/_module';

interface IEdge {
  from: string;
  to: string;
}

export default class CaffeModel extends Net {

  public name: string;

  constructor(private modelPath?: string, private weightPath?: string) {
    super();
  }

  load() {
    return this.fetch(this.modelPath)
      .then((model) => this.create(model))
      .then((model) => this.loadWeights());
  }

  fromText(def: string) {
    var protoParser = new PrototxtParser();
    this.create(protoParser.parseString(def))
    return this;
  }

  fetch(url: string) {
    var protoParser = new PrototxtParser();
    return protoParser.parse(url);
  }

  create(model: any) {
    this.name = model.name;

    this.createLayers(model, model.layer || model.layers, model.input === 'data');
    this.createEdges();
  }

  caffeLayerToJs(layerOpt: any): ILayer {

    var layer: ILayer;
    var opt: any = { name: layerOpt.name, input: layerOpt.bottom, output: layerOpt.top };

    // Get predecessors of the current layers
    if (layerOpt.bottom !== undefined){
      if (!Array.isArray(layerOpt.bottom)) {
        opt.pred = [this.layers.get(layerOpt.bottom)];
      }
      else {
        opt.pred = layerOpt.bottom.map((d) => this.layers.get(d));
      }
    }

    switch (layerOpt.type.toLowerCase()) {

      case 'input':
        var p = layerOpt.input_param || {};
        opt.out_depth = +p.shape.dim[1];
        opt.out_sx = +p.shape.dim[2];
        opt.out_sy = +p.shape.dim[3];
        layer = new Layers.InputLayer(opt);
        break;

      case 'conv':
      case 'convolution':
        var p = layerOpt.param || {};
        var cp = layerOpt.convolution_param || {};
        opt.sx = cp.kernel_size !== undefined ? +cp.kernel_size : undefined;
        opt.filters = cp.num_output !== undefined ? +cp.num_output : undefined;
        opt.pad = cp.pad !== undefined ? +cp.pad : undefined;
        opt.stride = cp.stride !== undefined ? +cp.stride : undefined;
        opt.l1_decay_mul = p && p.length && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0;
        opt.l2_decay_mul = p && p.length && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0;
        opt.group = cp.group !== undefined ? +cp.group : 1;
        layer = new Layers.ConvLayer(opt);
        break;

      case 'lrn':
        var p = layerOpt.lrn_param || {};
        opt.k = p.k !== undefined ? +p.k : 1;
        opt.n = p.local_size !== undefined ? +p.local_size : undefined;
        opt.alpha = p.alpha !== undefined ? +p.alpha : undefined;
        opt.beta = p.beta !== undefined ? +p.beta : undefined;
        layer = new Layers.LocalResponseNormalizationLayer(opt);
        break;

      case 'dropout':
        var dp = layerOpt.dropout_param || {};
        opt.drop_prob = dp.dropout_ratio !== undefined ? +dp.dropout_ratio : undefined;
        layer = new Layers.DropoutLayer(opt);
        break;

      case 'concat':
        var cp = layerOpt.concat_param || {};
        opt.axis = cp.axis !== undefined ? +cp.axis : undefined;
        layer = new Layers.ConcatLayer(opt);
        break;

      case 'pool':
      case 'pooling':
        var pp = layerOpt.pooling_param || {};
        opt.pool = pp.pool !== undefined ? pp.pool : undefined;
        opt.sx = pp.kernel_size !== undefined ? +pp.kernel_size : undefined;
        opt.pad = pp.pad !== undefined ? +pp.pad : undefined;
        opt.stride = pp.stride !== undefined ? +pp.stride : undefined;
        layer = new Layers.PoolLayer(opt);
        break;

      case 'inner_product':
      case 'innerproduct':
        var pp = layerOpt.inner_product_param || {};
        var p = layerOpt.param || {};
        opt.num_neurons = pp.num_output !== undefined ? +pp.num_output : undefined;
        opt.l1_decay_mul = p && p.length && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0;
        opt.l2_decay_mul = p && p.length && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0;
        layer = new Layers.FullyConnectedLayer(opt);
        break;

      case 'softmax': layer = new Layers.SoftmaxLayer(opt); break;
      case 'relu': layer = new Layers.ReluLayer(opt); break;
      case 'sigmoid': layer = new Layers.SigmoidLayer(opt); break;
      case 'tanh': layer = new Layers.TanhLayer(opt); break;

      default:
        console.error('Cannot parse layer ' + layerOpt.type, layerOpt);
        return;
    }

    this.layers.set(layer.name, layer);
  }

  createLayers(model: any, layers: any, makeInput: boolean = false) {
    this.layers = d3.map<ILayer>();

    // Create Input layer manually
    if (makeInput) {
      this.layers.set('data', new Layers.InputLayer({
          name: 'data',
          in_depth: +model.input_dim[1],
          in_sy: +model.input_dim[2],
          in_sx: +model.input_dim[3],
        })
      );
    }

    // Create all other layers
    layers.forEach((d) => this.caffeLayerToJs(d));
  }

  createEdges() {
    this.edges = [];

    this.layers.values()
      .filter((d: any) => d.input !== undefined && d.input !== d.output)
      .forEach((d: any) => {
        if (!Array.isArray(d.input)) {
          this.edges.push({ from: d.input, to: d.output });
        }
        else {
          d.input.forEach((layerName: string) => {
            this.edges.push({ from: layerName, to: d.output });
          });
        }
      });

    // Parse self-loops in Caffe
    // (usually for ReLU layers due to performance reasons)
    // To make this library more efficient,
    // we should allow and implement these self loops
    this.layers.values()
      .filter((d: any) => d.input !== undefined && d.input === d.output)
      .forEach((d: any) => {
        this.edges
          .filter((edge: IEdge) => edge.from === d.input)
          .forEach((edge: IEdge) => {
            edge.from = d.name;
            this.edges.push({ from: d.input, to: d.name });
          })
      });
  }

  loadWeights(): any {
    if (!this.weightPath) {
      return Promise.resolve();
    }
    // Load all separate weights for the layers
    return Promise.all(this.layers.values()
      .filter((d) => d.layer_type == 'conv' || d.layer_type == 'fc')
      .map((layer: any) => {
          return Promise.all([
            fetch(this.weightPath + layer.name + '_filter.bin')
              .then((response) => response.arrayBuffer())
              .then((arrayBuffer) => {
                var f = new Float32Array(arrayBuffer);
                var n = layer.num_inputs === undefined
                  ? Math.ceil(layer.sx * layer.sy * layer.in_depth / layer.conv_groups)
                  : layer.num_inputs;
                for(var i=0; i<layer.out_depth; i++) {
                  layer.filters[i].w.set(f.slice(i*n, i*n+n));
                }
              }),
            fetch(this.weightPath + layer.name + '_bias.bin')
              .then((response) => response.arrayBuffer())
              .then((arrayBuffer) => {
                var f = new Float32Array(arrayBuffer);
                layer.biases.w.set(f);
              })
          ]);
      }));
  }
}