/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // implements an L2 regression cost layer,
  // so penalizes \sum_i(||x_i - y_i||^2), where x is its input
  // and y is the user-provided array of "correct" values.
  export class SVMLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'svm';

    public in_act: Vol;
    public out_act: Vol;

    public num_inputs: number;

    constructor(opt) {
      super(opt || {});
      
      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.out_act = V;
      return V; // identity function
    }

    backward(y) {

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;
      x.dw = nj.zeros(x.w.length); // zero out the gradient of input Vol

      // we're using structured loss here, which means that the score
      // of the ground truth should be higher than the score of any other 
      // class, by a margin
      var yscore = x.w[y]; // score of ground truth
      var margin = 1.0;
      var loss = 0.0;
      for (var i = 0; i < this.out_depth; i++) {
        if (y === i) { continue; }
        var ydiff = -yscore + x.w[i] + margin;
        if (ydiff > 0) {
          // violating dimension, apply loss
          x.dw[i] += 1;
          x.dw[y] -= 1;
          loss += ydiff;
        }
      }

      return loss;
    }

    updateDimensions(pred: ILayer) {

      if (pred){
        this.in_sx = pred.out_sx;
        this.in_sy = pred.out_sy;
        this.in_depth = pred.out_depth;
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