import BaseLayer from './BaseLayer';
import Vol from '../Vol';
import {ILayer} from '../ILayer';
import {getopt} from '../Utils';
import * as nj from '../../NumJS/_module';

export default class ConcatLayer extends BaseLayer implements ILayer {

  public layer_type: string = 'concat';

  public in_act: Vol[];
  public out_act: Vol;

  public axis: number;

  constructor(opt) {
    super(opt || {});

    this.axis = getopt(opt, ['axis'], 1);

    this.updateDimensions(opt.pred);
  }
  
  forward(Vs, is_training) {
    this.in_act = Vs;
    this.resetGradient();
    var V2 = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
    var offset = 0;
    if (this.axis === 0) {
      var V2w = V2.w;
      for (var j = 0; j < Vs.length; j++) {
        V2w.set(Vs[j].w, offset);
        offset += Vs[j].w.length;
      }
    }
    else {
      for (let j = 0; j < Vs.length; j++) {
        let V = Vs[j];
        for (let d = 0; d < V.depth; d++)
          for (let x = 0; x < V.sx; x++) {
            for (let y = 0; y < V.sy; y++) {
              V2.set(x, y, d + offset, V.get(x, y, d));
            }
          }
        offset += V.depth;
      }
    }
    this.out_act = V2;
    return this.out_act;
  }

  backward() {
    var Vs = this.in_act; // we need to set dw of these
    var V2 = this.out_act;
    var offset = 0;
    if (this.axis === 0) {
      let V2dw = V2.dw;
      for (let j = 0; j < Vs.length; j++) {
        let Vdw = Vs[j].dw;
        Vdw = nj.add(Vdw, V2dw.slice(offset, offset + Vdw.length));
        offset += Vdw.length;
      }
    }
    else {
      for (let j = 0, len = Vs.length; j < len; ++j) {
        let V = Vs[j];
        let Vdw = Vs[j].dw;
        for (let d = 0, depth = V.depth; d < depth; ++d)
          for (let x = 0, sx = V.sx; x < sx; ++x) {
            for (let y = 0, sy = V.sy; y < sy; ++y) {
              V.add_grad(x, y, d, V2.get_grad(x, y, d + offset));
            }
          }
        offset += V.depth;
      }
    }
  }

  updateDimensions(pred: ILayer[]) {
    if (pred) {
      // concatenation along num
      // (n_1 + n_2 + ... + n_K) * c_1 * h * w, and all input c_i should be the same.
      if (this.axis == 0) {
        this.in_sx = pred[0].in_sx;
        this.in_sy = pred[0].in_sy;
        this.in_depth = pred[0].in_depth;
      }
      // concatenate along channels
      // n_1 * (c_1 + c_2 + ... + c_K) * h * w, and all input n_i should be the same
      else {
        this.in_sx = pred[0].in_sx;
        this.in_sy = pred[0].in_sy;
        this.in_depth = nj.sum(pred.map((d) => d.out_depth));
      }
    }
    
    this.out_sx = this.in_sx;
    this.out_sy = this.in_sy;
    this.out_depth = this.in_depth;
  }

  toJSON() {
    var json: any = super.toJSON();
    json.axis = this.axis;
    return json;
  }

  fromJSON(json:any) {
    super.fromJSON(json);
    this.axis = json.axis;
  }
}