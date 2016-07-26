/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  export class ConvLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'conv';

    public in_act: Vol;
    public out_act: Vol;

    public sx: number;
    public sy: number;
    public stride: number;
    public pad: number;
    public l1_decay_mul: number;
    public l2_decay_mul: number;

    public biases: Vol;
    public filters: Vol[];

    constructor(opt) {
      super(opt || {});

      // required
      this.out_depth = opt.filters;
      
      // filter size. Should be odd if possible, it's cleaner.
      this.sx = opt.sx;

      // optional
      this.sy = getopt(opt, ['sy'], this.sx);

      // stride at which we apply filters to input volume
      this.stride = getopt(opt, ['stride'], 1);
      
      // amount of 0 padding to add around borders of input volume
      this.pad = getopt(opt, ['pad'], 0);
      
      this.l1_decay_mul = getopt(opt, ['l1_decay_mul'], 0.0);
      this.l2_decay_mul = getopt(opt, ['l2_decay_mul'], 1.0);

      this.updateDimensions(opt.pred);
      
      // initialize bias
      var bias = getopt(opt, ['bias_pref'], 0.0);
      this.biases = new Vol(1, 1, this.out_depth, bias);
      
      // initialize filters
      this.filters = [];
      for (let i = 0; i < this.out_depth; ++i) {
        this.filters.push(new Vol(this.sx, this.sy, this.in_depth, 0.0));
      }
    }

    forward(V, is_training) {
      // optimized code by @mdda that achieves 2x speedup over previous version

      this.in_act = V;
      this.resetGradient();
      var A = new Vol(this.out_sx | 0, this.out_sy | 0, this.out_depth | 0, 0.0);

      var V_sx = V.sx | 0;
      var V_sy = V.sy | 0;
      var xy_stride = this.stride | 0;

      for (var d = 0; d < this.out_depth; ++d) {
        var f = this.filters[d];
        var x = -this.pad | 0;
        var y = -this.pad | 0;
        for (var ay = 0; ay < this.out_sy; y += xy_stride, ++ay) {  // xy_stride
          x = -this.pad | 0;
          for (var ax = 0; ax < this.out_sx; x += xy_stride, ++ax) {  // xy_stride

            // convolve centered at this particular location
            var a = 0.0;
            for (var fy = 0; fy < f.sy; ++fy) {
              var oy = y + fy; // coordinates in the original input array coordinates
              for (var fx = 0; fx < f.sx; ++fx) {
                var ox = x + fx;
                if (oy >= 0 && oy < V_sy && ox >= 0 && ox < V_sx) {
                  for (var fd = 0; fd < f.depth; ++fd) {
                    // avoid function call overhead (x2) for efficiency, compromise modularity :(
                    a += f.w[((f.sx * fy) + fx) * f.depth + fd] * V.w[((V_sx * oy) + ox) * V.depth + fd];
                  }
                }
              }
            }
            a += this.biases.w[d];
            A.set(ax, ay, d, a);
          }
        }
      }
      this.out_act = A;
      return this.out_act;
    }

    backward() {
      var V = this.in_act;
      var V_sx = V.sx | 0;
      var V_sy = V.sy | 0;
      var xy_stride = this.stride | 0;

      for (var d = 0; d < this.out_depth; ++d) {
        var f = this.filters[d];
        var x = -this.pad | 0;
        var y = -this.pad | 0;
        for (var ay = 0; ay < this.out_sy; y += xy_stride, ++ay) {  // xy_stride
          x = -this.pad | 0;
          for (var ax = 0; ax < this.out_sx; x += xy_stride, ++ax) {  // xy_stride

            // convolve centered at this particular location
            var chain_grad = this.out_act.get_grad(ax, ay, d); // gradient from above, from chain rule
            for (var fy = 0; fy < f.sy; ++fy) {
              var oy = y + fy; // coordinates in the original input array coordinates
              for (var fx = 0; fx < f.sx; ++fx) {
                var ox = x + fx;
                if (oy >= 0 && oy < V_sy && ox >= 0 && ox < V_sx) {
                  for (var fd = 0; fd < f.depth; ++fd) {
                    // avoid function call overhead (x2) for efficiency, compromise modularity :(
                    var ix1 = ((V_sx * oy) + ox) * V.depth + fd;
                    var ix2 = ((f.sx * fy) + fx) * f.depth + fd;
                    f.dw[ix2] += V.w[ix1] * chain_grad;
                    V.dw[ix1] += f.w[ix2] * chain_grad;
                  }
                }
              }
            }
            this.biases.dw[d] += chain_grad;
          }
        }
      }
    }

    getParamsAndGrads() {
      var response = [];
      for (var i = 0; i < this.out_depth; i++) {
        response.push({
          params: this.filters[i].w,
          grads: this.filters[i].dw,
          l2_decay_mul: this.l2_decay_mul,
          l1_decay_mul: this.l1_decay_mul
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
      
      this.out_sx = Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
      this.out_sy = Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
    }

    getNumParameters() {
      return [this.in_depth * this.sx * this.sy * this.out_depth, this.out_depth];
    }

    getOutputShape() {
      return [
        this.out_depth,
        Math.ceil((this.in_sy + 2 * this.pad - this.sy + 1 + this.stride - 1) / this.stride),
        Math.ceil((this.in_sx + 2 * this.pad - this.sx + 1 + this.stride - 1) / this.stride),
      ]
    }

    getDescription() {
      return super.getDescription().concat([
        [this.out_depth, this.sy, this.sx].join('x') + ' Stride ' + this.stride + ' Pad ' + this.pad
      ]);
    }

    toJSON() {
      var json: any = super.toJSON();
      json.sx = this.sx; // filter size in x, y dims
      json.sy = this.sy;
      json.stride = this.stride;
      json.in_depth = this.in_depth;
      json.l1_decay_mul = this.l1_decay_mul;
      json.l2_decay_mul = this.l2_decay_mul;
      json.pad = this.pad;
      json.filters = [];
      for (var i = 0; i < this.filters.length; i++) {
        json.filters.push(this.filters[i].toJSON());
      }
      json.biases = this.biases.toJSON();
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.sx = json.sx; // filter size in x, y dims
      this.sy = json.sy;
      this.stride = json.stride;
      this.in_depth = json.in_depth; // depth of input volume
      this.filters = [];
      this.l1_decay_mul = json.l1_decay_mul !== undefined ? json.l1_decay_mul : 0.0;
      this.l2_decay_mul = json.l2_decay_mul !== undefined ? json.l2_decay_mul : 1.0;
      this.pad = json.pad !== undefined ? json.pad : 0;
      for (var i = 0; i < json.filters.length; i++) {
        this.filters.push(Vol.fromJSON(json.filters[i]));
      }
      this.biases = Vol.fromJSON(json.biases);
    }
  }
}