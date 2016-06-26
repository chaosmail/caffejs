/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // Implements ReLU nonlinearity elementwise
  // x -> max(0, x)
  // the output is in [0, inf)
  export class ReluLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'relu';

    public in_act: Vol;
    public out_act: Vol;

    constructor(opt) {
      super(opt || {});

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      var V2 = V.clone();
      var N = V.w.length;
      var V2w = V2.w;
      for (var i = 0; i < N; i++) {
        if (V2w[i] < 0) V2w[i] = 0; // threshold at 0
      }
      this.out_act = V2;
      return this.out_act;
    }

    backward() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = V.w.length;
      V.dw = nj.zeros(N); // zero out gradient wrt data
      for (var i = 0; i < N; i++) {
        if (V2.w[i] <= 0) V.dw[i] = 0; // threshold
        else V.dw[i] = V2.dw[i];
      }
    }
  }
}