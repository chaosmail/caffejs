/// <reference path="../../NumJS/index.ts" />

namespace Net {

  import nj = NumJS;

  export class Vol {

    public w: Float32Array;
    public dw: Float32Array;

    constructor(public sx: number, public sy: number, public depth: number, fill?: number) {
      // we were given dimensions of the vol
      var n = this.sx * this.sy * this.depth;
      this.w = nj.zeros(n);
      this.dw = nj.zeros(n);
      if (fill === undefined) {
        // weight normalization is done to equalize the output
        // variance of every neuron, otherwise neurons with a lot
        // of incoming connections have outputs of larger variance
        let scale = Math.sqrt(1.0 / n);
        for (let i = 0; i < n; ++i) {
          this.w[i] = nj.randn(0.0, scale);
        }
      }
      // The weights are already zero filled, so we need to do this
      // only when using a different constant
      else if (fill !== 0.0) {
        nj.fill(this.w, fill);
      }
    }

    static fromArray(A: Float32Array): Vol {
      // we were given a list in A, assume 1D volume and fill it up
      var vol = new Vol(1, 1, A.length, 0.0);
      vol.w.set(A);
      return vol;
    }

    clone(): Vol {
      var vol = new Vol(this.sx, this.sy, this.depth, 0.0);
      vol.w.set(this.w);
      return vol;
    }

    cloneAndZero(): Vol {
      var vol = new Vol(this.sx, this.sy, this.depth, 0.0);
      return vol;
    }

    get(x, y, d) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      return this.w[ix];
    }

    set(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.w[ix] = v;
    }

    add(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.w[ix] += v;
      return this;
    }

    sub(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.w[ix] -= v;
      return this;
    }

    mul(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.w[ix] *= v;
      return this;
    }

    div(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.w[ix] /= v;
      return this;
    }

    get_grad(x, y, d) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      return this.dw[ix];
    }

    set_grad(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.dw[ix] = v;
    }

    add_grad(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.dw[ix] += v;
    }

    sub_grad(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.dw[ix] -= v;
    }

    mul_grad(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.dw[ix] *= v;
    }

    div_grad(x, y, d, v) {
      var ix = ((this.sx * y) + x) * this.depth + d;
      this.dw[ix] /= v;
    }


    roll(ox: number = 0.0, oy: number = 0.0, od: number = 0.0) {
      var V2 = this.clone();
      for (let d = 0, depth = V2.depth; d < depth; ++d) {
        for (let x = 0, sx = V2.sx; x < sx; ++x) {
          for (let y = 0, sy = V2.sy; y < sy; ++y) {
            let dval = this.get(nj.mod((x + ox), this.sx), nj.mod((y + oy), this.sy), nj.mod((d + od), this.depth));
            V2.set(x, y, d, dval);
          }
        }
      }
      return V2;
    }

    zoom(zx: number = 1.0, zy: number = 1.0, zd: number = 1.0) {
      var V2 = new Vol(Math.round(this.sx * zx), Math.round(this.sy * zy), Math.round(this.depth * zd), 0.0);
      for (let d = 0, depth = V2.depth; d < depth; ++d) {
        for (let x = 0, sx = V2.sx; x < sx; ++x) {
          for (let y = 0, sy = V2.sy; y < sy; ++y) {
            let n = 0;
            let ox = Math.ceil(1.0 / zx);
            let oy = Math.ceil(1.0 / zy);
            let od = Math.ceil(1.0 / zd);
            let startx = Math.ceil(x / zx);
            let starty = Math.ceil(y / zy);
            let startd = Math.ceil(d / zd);
            let endx = Math.min(startx + ox, this.sx);
            let endy = Math.min(starty + oy, this.sy);
            let endd = Math.min(startd + od, this.depth);
            for (let dx = startx; dx < endx; dx++) {
              for (let dy = starty; dy < endy; dy++) {
                for (let dd = startd; dd < endd; dd++) {
                  let dval = this.get(dx, dy, dd);
                  V2.add(x, y, d, dval);
                  n ++;
                }
              }
            }
            V2.div(x, y, d, n);
          }
        }
      }
      return V2;
    }
    
    toJSON() {
      // todo: we may want to only save d most significant digits to save space
      var json:any = {}
      json.sx = this.sx;
      json.sy = this.sy;
      json.depth = this.depth;
      json.w = this.w;
      return json;
      // we wont back up gradients to save space
    }

    static fromJSON(json: any) {
      var vol = new Vol(json.sx, json.sy, json.depth, 0.0);
      
      vol.w.set(json.w);

      return vol;
    }
  }

}