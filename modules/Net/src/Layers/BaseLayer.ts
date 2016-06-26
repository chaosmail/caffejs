/// <reference path="../../../NumJS/index.ts" />
/// <reference path="../Vol.ts" />
/// <reference path="../ILayer.ts" />
/// <reference path="../Utils.ts" />

namespace Net {

  export class BaseLayer {
    public in_act: Vol | Vol[];
    public out_act: Vol;
    
    public in_depth: number = 1;
    public in_sy: number = 1;
    public in_sx: number = 1;

    public out_depth: number = 1;
    public out_sy: number = 1;
    public out_sx: number = 1;

    public name: string;
    public input: string;
    public output: string;
    public layer_type: string;

    constructor(opt: any) {
      this.name = opt.name !== undefined ? opt.name : "";
      this.input = opt.input !== undefined ? opt.input : undefined;
      this.output = opt.output !== undefined ? opt.output : undefined;

      if (!opt.pred) {
        this.in_sx = opt.in_sx;
        this.in_sy = opt.in_sy;
        this.in_depth = opt.in_depth;
      }
    }

    updateDimensions(pred?: ILayer | ILayer[]) {

      if (<ILayer> pred){
        this.in_sx = (<ILayer> pred).out_sx;
        this.in_sy = (<ILayer> pred).out_sy;
        this.in_depth = (<ILayer> pred).out_depth;
      }

      this.out_sx = this.in_sx;
      this.out_sy = this.in_sy;
      this.out_depth = this.in_depth;
    }

    getNumParameters() {
      return [0, 0];
    }

    getOutputShape() {
      return [this.in_depth, this.in_sy, this.in_sx];
    }

    getDescription(){   
     return [this.layer_type.toUpperCase(), this.name];
    }

    getParamsAndGrads() {
      return [];
    }

    toJSON() {
      var json: any = {};
      json.out_depth = this.out_depth;
      json.out_sx = this.out_sx;
      json.out_sy = this.out_sy;
      json.layer_type = this.layer_type;
      json.name = this.name;
      json.output = this.output;
      json.input = this.input;
      return json;
    }

    fromJSON(json: any) {
      this.out_depth = json.out_depth;
      this.out_sx = json.out_sx;
      this.out_sy = json.out_sy;
      this.layer_type = json.layer_type;
      this.name = json.name;
      this.output = json.output;
      this.input = json.input;
    }
  }
}