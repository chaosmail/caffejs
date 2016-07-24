/// <reference path="BaseLayer.ts" />

namespace Net {

  import nj = NumJS;

  export class PoolLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'pool';

    public in_act: Vol;
    public out_act: Vol;

    public sx: number;
    public sy: number;
    public stride: number;
    public pad: number;
    public pool: string;

    public biases: Vol;
    public filters: Vol[];

    public switchx: Uint32Array;
    public switchy: Uint32Array;

    constructor(opt) {
      super(opt || {});

      // required
      this.out_depth = opt.filters;

      // filter size. Should be odd if possible, it's cleaner.
      this.sx = opt.sx;

      this.pool = getopt(opt, ['pool'], 'MAX');;

      // optional
      this.sy = getopt(opt, ['sy'], this.sx);

      // stride at which we apply filters to input volume
      this.stride = getopt(opt, ['stride'], 1);

      // amount of 0 padding to add around borders of input volume
      this.pad = getopt(opt, ['pad'], 0);

      this.updateDimensions(opt.pred);
    }
    
    forward(V, is_training) {
      this.in_act = V;
      this.switchx = nj.zeros(this.out_sx * this.out_sy * this.out_depth);
      this.switchy = nj.zeros(this.out_sx * this.out_sy * this.out_depth);

      var A = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);

      if (this.pool === 'AVE') {
        let n = this.sx * this.sy;
        for (let d = 0; d < this.out_depth; ++d) {
          for (let ax = 0; ax < this.out_sx; ++ax) {
            for (let ay = 0; ay < this.out_sy; ++ay) {
              let v = 0.0;
              let xstart = ax * this.stride - this.pad;
              let ystart = ay * this.stride - this.pad;
              let xend = Math.min(xstart + this.sx, this.out_sx + this.pad);
              let yend = Math.min(ystart + this.sy, this.out_sy + this.pad);
              let pool_size = (xend - xstart) * (yend - ystart);
              // perform average pooling
              for (let x = xstart; x < xend; ++x) {
                for (let y = ystart; y < yend; ++y) {
                  v += V.get(x, y, d);
                }
              }
              A.set(ax, ay, d, v / pool_size);
            }
          }
        }
      }
      else {
        var n = 0; // a counter for switches
        for (var d = 0; d < this.out_depth; ++d) {
          var x = -this.pad;
          var y = -this.pad;
          for (var ax = 0; ax < this.out_sx; x += this.stride, ax++) {
            y = -this.pad;
            for (var ay = 0; ay < this.out_sy; y += this.stride, ay++) {

              // convolve centered at this particular location
              var a = -99999; // hopefully small enough ;\
              var winx = -1, winy = -1;
              for (var fx = 0; fx < this.sx; ++fx) {
                for (var fy = 0; fy < this.sy; ++fy) {
                  var oy = y + fy;
                  var ox = x + fx;
                  if (oy >= 0 && oy < V.sy && ox >= 0 && ox < V.sx) {
                    var v = V.get(ox, oy, d);
                    // perform max pooling and store pointers to where
                    // the max came from. This will speed up backprop 
                    // and can help make nice visualizations in future
                    if (v > a) { a = v; winx = ox; winy = oy; }
                  }
                }
              }
              this.switchx[n] = winx;
              this.switchy[n] = winy;
              n++;
              A.set(ax, ay, d, a);
            }
          }
        }
      }
      this.out_act = A;
      return this.out_act;
    }

    backward() {
      // pooling layers have no parameters, so simply compute 
      // gradient wrt data here
      var V = this.in_act;
      V.dw = nj.zeros(V.w.length); // zero out gradient wrt data
      var A = this.out_act; // computed in forward pass 

      if (this.pool === 'AVE') {
        // TODO 
        // backprop for average pooling
      }
      else {
        var n = 0;
        for (var d = 0; d < this.out_depth; ++d) {
          var x = -this.pad;
          for (var ax = 0; ax < this.out_sx; x += this.stride, ax++) {
            var y = -this.pad;
            for (var ay = 0; ay < this.out_sy; y += this.stride, ay++) {
              var chain_grad = this.out_act.get_grad(ax, ay, d);
              V.add_grad(this.switchx[n], this.switchy[n], d, chain_grad);
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

      this.out_sx = Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
      this.out_sy = Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
      this.out_depth = this.in_depth;
    }

    getOutputShape() {
      return [
        this.out_depth,
        Math.ceil((this.in_sy + 2 * this.pad - this.sy + 1 + this.stride - 1) / this.stride),
        Math.ceil((this.in_sx + 2 * this.pad - this.sx + 1 + this.stride - 1) / this.stride),
      ]
    }

    getDescription() {
      return [
        this.pool + " " + this.layer_type.toUpperCase(), 
        this.name,
        [this.sy, this.sx].join('x') + ' Stride ' + this.stride + ' Pad ' + this.pad
      ];
    }

    toJSON() {
      var json: any = super.toJSON();
      json.sx = this.sx;
      json.sy = this.sy;
      json.stride = this.stride;
      json.pool = this.pool;
      json.in_depth = this.in_depth;
      json.pad = this.pad;
      return json;
    }

    fromJSON(json: any) {
      super.fromJSON(json);
      this.pool = json.pool !== undefined ? json.pool : 'MAX';
      this.sx = json.sx;
      this.sy = json.sy;
      this.stride = json.stride;
      this.in_depth = json.in_depth;
      this.pad = json.pad !== undefined ? json.pad : 0; // backwards compatibility
      this.switchx = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array); // need to re-init these appropriately
      this.switchy = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array);
    }
  }
}