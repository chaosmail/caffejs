/// <reference path="./BaseLayer.ts" />

namespace Net.Layers {

  const nj = NumJS;

  // This is a classifier, with N discrete classes from 0 to N-1
  // it gets a stream of N incoming numbers and computes the softmax
  // function (exponentiate and normalize to sum to 1 as probabilities should)
  export class SoftmaxLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'softmax';

    public in_act: Vol;
    public out_act: Vol;

    public num_inputs: number;
    private es: Float32Array;

    constructor(opt) {
      super(opt || {});

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.resetGradient();

      var A = new Vol(1, 1, this.out_depth, 0.0);

      // compute max activation
      var as = V.w;
      var amax = V.w[0];
      for(var i=1;i<this.out_depth;i++) {
        if(as[i] > amax) amax = as[i];
      }

      // compute exponentials (carefully to not blow up)
      var es = nj.zeros(this.out_depth);
      var esum = 0.0;
      for(var i=0;i<this.out_depth;i++) {
        var e = Math.exp(as[i] - amax);
        esum += e;
        es[i] = e;
      }

      // normalize and output to sum to one
      for(var i=0;i<this.out_depth;i++) {
        es[i] /= esum;
        A.w[i] = es[i];
      }

      this.es = es; // save these for backprop
      this.out_act = A;
      return this.out_act;
    }

    backward(y) {

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;

      for (var i = 0; i < this.out_depth; i++) {
        var indicator = i === y ? 1.0 : 0.0;
        var mul = -(indicator - this.es[i]);
        x.dw[i] += mul;
      }

      // loss is the class negative log likelihood
      return -Math.log(this.es[y]);
    }

    updateDimensions(pred: ILayer[]) {

      if (pred){
        this.in_sx = pred[0].out_sx;
        this.in_sy = pred[0].out_sy;
        this.in_depth = pred[0].out_depth;
      }

      this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
      this.out_depth = this.num_inputs;
    }

    getOutputShape() {
      return [this.out_depth, 1, 1]
    }

    toJSON() {
      var json: any = super.toJSON();
      json.num_inputs = this.num_inputs;
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.num_inputs = json.num_inputs;
    }
  }
}