/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // implements an L2 regression cost layer,
  // so penalizes \sum_i(||x_i - y_i||^2), where x is its input
  // and y is the user-provided array of "correct" values.
  export class RegressionLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'regression';

    public in_act: Vol;
    public out_act: Vol;

    public num_inputs: number;

    constructor(opt) {
      super(opt || {});

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.resetGradient();
      this.out_act = V;
      return V; // identity function
    }

    // y is a list here of size num_inputs
    // or it can be a number if only one value is regressed
    // or it can be a struct {dim: i, val: x} where we only want to 
    // regress on dimension i and asking it to have value x
    backward(y) {

      // compute and accumulate gradient wrt weights and bias of this layer
      var x = this.in_act;
      var loss = 0.0;
      if (y instanceof Float32Array) {
        for (let i = 0; i < this.out_depth; i++) {
          let dy = x.w[i] - y[i];
          x.dw[i] = dy;
          loss += 0.5 * dy * dy;
        }
      } else if (typeof y === 'number') {
        // lets hope that only one number is being regressed
        let dy = x.w[0] - y;
        x.dw[0] = dy;
        loss += 0.5 * dy * dy;
      } else {
        // assume it is a struct with entries .dim and .val
        // and we pass gradient only along dimension dim to be equal to val
        let i = y.dim;
        let yi = y.val;
        let dy = x.w[i] - yi;
        x.dw[i] = dy;
        loss += 0.5 * dy * dy;
      }
      return loss;
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