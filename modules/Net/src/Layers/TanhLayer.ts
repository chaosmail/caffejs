/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // Implements Tanh nnonlinearity elementwise
  // x -> tanh(x) 
  // so the output is between -1 and 1.
  export class TanhLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'tanh';

    public in_act: Vol;
    public out_act: Vol;

    constructor(opt) {
      super(opt || {});

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.resetGradient();
      var V2 = V.cloneAndZero();
      var N = V.w.length;
      for (var i = 0; i < N; i++) {
        V2.w[i] = nj.tanh(V.w[i]);
      }
      this.out_act = V2;
      return this.out_act;
    }

    backward() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = V.w.length;
      for (var i = 0; i < N; i++) {
        var v2wi = V2.w[i];
        V.dw[i] += (1.0 - v2wi * v2wi) * V2.dw[i];
      }
    }
  }
}