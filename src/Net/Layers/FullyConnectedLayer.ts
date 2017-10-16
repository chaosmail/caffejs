/// <reference path="./BaseLayer.ts" />

namespace Net.Layers {

  const nj = NumJS;

  export class FullyConnectedLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'fc';

    public in_act: Vol;
    public out_act: Vol;

    public sx: number = 1;
    public sy: number = 1;

    public num_inputs: number;
    public l1_decay_mul: number;
    public l2_decay_mul: number;

    public conv_groups:number = 1;

    public biases: Vol;
    public filters: Vol[];

    constructor(opt) {
      super(opt || {});

      // required
      // ok fine we will allow 'filters' as the word as well
      this.out_depth = opt.num_neurons !== undefined ? opt.num_neurons : opt.filters;

      // optional 
      this.l1_decay_mul = getopt(opt, ['l1_decay_mul'], 0.0);
      this.l2_decay_mul = getopt(opt, ['l2_decay_mul'], 1.0);
      
      this.updateDimensions(opt.pred);

      // initialize bias
      var bias = getopt(opt, ['bias_pref'], 0.0);
      this.biases = new Vol(1, 1, this.out_depth, bias);

      // initialize filters
      this.filters = [];
      for (let i = 0; i < this.out_depth; ++i) {
        this.filters.push(new Vol(1, 1, this.num_inputs, 0.0));
      }

      if (opt.filters !== undefined) {
        for (let i = 0; i < this.out_depth; ++i) {
          this.filters[i].w.set(opt.filters[i]);
        }
      }

      if (opt.biases !== undefined) {
        this.biases.w.set(opt.biases);
      }
    }

    resetGradient() {
      super.resetGradient();

      for (let i = 0; i < this.out_depth; ++i) {
        this.filters[i].dw = nj.zeros((<Vol>this.filters[i]).w.length);
      } 
      this.biases.dw = nj.zeros(this.out_depth);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.resetGradient();
      var A = new Vol(1, 1, this.out_depth, 0.0);
      var Vw = V.w;
      for (var i = 0; i < this.out_depth; ++i) {
        var a = 0.0;
        var wi = this.filters[i].w;
        for (var d = 0; d < this.num_inputs; ++d) {
          a += Vw[d] * wi[d]; // for efficiency use Vols directly for now
        }
        a += this.biases.w[i];
        A.w[i] = a;
      }
      this.out_act = A;
      return this.out_act;
    }

    backward() {
      var V = this.in_act;

      // compute gradient wrt weights and data
      for (var i = 0; i < this.out_depth; ++i) {
        var tfi = this.filters[i];
        var chain_grad = this.out_act.dw[i];
        for (var d = 0; d < this.num_inputs; ++d) {
          V.dw[d] += tfi.w[d] * chain_grad; // grad wrt input data
          tfi.dw[d] += V.w[d] * chain_grad; // grad wrt params
        }
        this.biases.dw[i] += chain_grad;
      }
    }

    getParamsAndGrads() {
      var response = [];
      for (var i = 0; i < this.out_depth; ++i) {
        response.push({
          params: this.filters[i].w,
          grads: this.filters[i].dw,
          l1_decay_mul: this.l1_decay_mul,
          l2_decay_mul: this.l2_decay_mul
        });
      }
      response.push({
        params: this.biases.w,
        grads: this.biases.dw,
        l1_decay_mul: 0.0,
        l2_decay_mul: 0.0
      });
      return response;
    }

    updateDimensions(pred: ILayer[]) {
      if (pred){
        this.in_sx = pred[0].out_sx;
        this.in_sy = pred[0].out_sy;
        this.in_depth = pred[0].out_depth;
      }

      this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
    }

    getNumParameters() {
      return [this.in_depth * this.in_sx * this.in_sy * this.out_depth, this.out_depth];
    }

    getOutputShape() {
      return [this.out_depth, 1, 1]
    }

    getDescription(){   
     return [this.layer_type.toUpperCase(), this.name, this.out_depth.toString()];
    }

    toJSON() {
      var json: any = super.toJSON();
      json.num_inputs = this.num_inputs;
      json.l1_decay_mul = this.l1_decay_mul;
      json.l2_decay_mul = this.l2_decay_mul;
      json.filters = [];
      for (var i = 0; i < this.filters.length; i++) {
        json.filters.push(this.filters[i].toJSON());
      }
      json.biases = this.biases.toJSON();
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.num_inputs = json.num_inputs;
      this.l1_decay_mul = json.l1_decay_mul !== undefined ? json.l1_decay_mul : 1.0;
      this.l2_decay_mul = json.l2_decay_mul !== undefined ? json.l2_decay_mul : 1.0;
      this.filters = [];
      for (var i = 0; i < json.filters.length; i++) {
        this.filters.push(Vol.fromJSON(json.filters[i]));
      }
      this.biases = Vol.fromJSON(json.biases);
    }
  }
}
