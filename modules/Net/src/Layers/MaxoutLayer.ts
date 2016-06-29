/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  // Implements Maxout nnonlinearity that computes
  // x -> max(x)
  // where x is a vector of size group_size. Ideally of course,
  // the input size should be exactly divisible by group_size
  export class MaxoutLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'maxout';

    public in_act: Vol;
    public out_act: Vol;

    public group_size: number;
    public switches: Uint32Array;

    constructor(opt) {
      super(opt || {});

      // required
      this.group_size = opt.group_size !== undefined ? opt.group_size : 2;

      this.updateDimensions(opt.pred);
    }

    forward(V, is_training) {
      this.in_act = V;
      this.switches = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array); // useful for backprop
      
      var N = this.out_depth;
      var V2 = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);

      // optimization branch. If we're operating on 1D arrays we dont have
      // to worry about keeping track of x,y,d coordinates inside
      // input volumes. In convnets we do :(
      if (this.out_sx === 1 && this.out_sy === 1) {
        for (var i = 0; i < N; i++) {
          var ix = i * this.group_size; // base index offset
          var a = V.w[ix];
          var ai = 0;
          for (var j = 1; j < this.group_size; j++) {
            var a2 = V.w[ix + j];
            if (a2 > a) {
              a = a2;
              ai = j;
            }
          }
          V2.w[i] = a;
          this.switches[i] = ix + ai;
        }
      } else {
        var n = 0; // counter for switches
        for (var x = 0; x < V.sx; x++) {
          for (var y = 0; y < V.sy; y++) {
            for (var i = 0; i < N; i++) {
              var ix = i * this.group_size;
              var a = V.get(x, y, ix);
              var ai = 0;
              for (var j = 1; j < this.group_size; j++) {
                var a2 = V.get(x, y, ix + j);
                if (a2 > a) {
                  a = a2;
                  ai = j;
                }
              }
              V2.set(x, y, i, a);
              this.switches[n] = ix + ai;
              n++;
            }
          }
        }

      }
      this.out_act = V2;
      return this.out_act;
    }

    backward() {
      var V = this.in_act; // we need to set dw of this
      var V2 = this.out_act;
      var N = this.out_depth;
      V.dw = nj.zeros(V.w.length); // zero out gradient wrt data

      // pass the gradient through the appropriate switch
      if (this.out_sx === 1 && this.out_sy === 1) {
        for (var i = 0; i < N; i++) {
          var chain_grad = V2.dw[i];
          V.dw[this.switches[i]] = chain_grad;
        }
      } else {
        // bleh okay, lets do this the hard way
        var n = 0; // counter for switches
        for (var x = 0; x < V2.sx; x++) {
          for (var y = 0; y < V2.sy; y++) {
            for (var i = 0; i < N; i++) {
              var chain_grad = V2.get_grad(x, y, i);
              V.set_grad(x, y, this.switches[n], chain_grad);
              n++;
            }
          }
        }
      }
    }

    updateDimensions(pred: ILayer[]) {

      if (pred){
        this.in_sx = pred[0].out_sx;
        this.in_sy = pred[0].out_sy;
        this.in_depth = pred[0].out_depth;
      }

      this.out_sx = this.in_sx;
      this.out_sy = this.in_sy;
      this.out_depth = Math.floor(this.in_depth / this.group_size);
    }

    toJSON() {
      var json: any = super.toJSON();
      json.group_size = this.group_size;
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.group_size = json.group_size;
    }
  }
}