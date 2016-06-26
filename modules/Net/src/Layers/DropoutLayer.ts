/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // An inefficient dropout layer
  // Note this is not most efficient implementation since the layer before
  // computed all these activations and now we're just going to drop them :(
  // same goes for backward pass. Also, if we wanted to be efficient at test time
  // we could equivalently be clever and upscale during train and copy pointers during test
  // todo: make more efficient.
  export class DropoutLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'dropout';

    public in_act: Vol;
    public out_act: Vol;

    public drop_prob: number;
    public dropped: Int8Array;

    constructor(opt) {
      super(opt || {});

      this.drop_prob = getopt(opt, ['drop_prob'], 0.5);

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training = false) {
      this.in_act = V;
      this.dropped = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Int8Array);
      var V2 = V.clone();
      var N = V.w.length;
      if (is_training) {
        // do dropout
        for (var i = 0; i < N; i++) {
          // drop!
          if (Math.random() < this.drop_prob) {
            V2.w[i] = 0;
            this.dropped[i] = 1;
          }
        }
      } else {
        // scale the activations during prediction
        for (var i = 0; i < N; i++) {
          V2.w[i] *= this.drop_prob;
        }
      }
      this.out_act = V2;
      return this.out_act; // dummy identity function for now
    }

    backward() {
      var V = this.in_act; // we need to set dw of this
      var chain_grad = this.out_act;
      var N = V.w.length;
      V.dw = nj.zeros(N); // zero out gradient wrt data
      for (var i = 0; i < N; i++) {
        if (this.dropped[i] !== 1) {
          V.dw[i] = chain_grad.dw[i]; // copy over the gradient
        }
      }
    }

    toJSON() {
      var json: any = super.toJSON();
      json.drop_prob = this.drop_prob;
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.drop_prob = json.drop_prob;
    }
  }
}