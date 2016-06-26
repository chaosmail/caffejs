/// <reference path="BaseLayer.ts" />

namespace Net {
  
  import nj = NumJS;
  
  export class InputLayer extends BaseLayer implements ILayer {

    public layer_type: string = 'input';

    public in_act: Vol;
    public out_act: Vol;

    constructor(opt) {
      super(opt || {});

      // required: depth
      this.in_depth = getopt(opt, ['in_depth', 'out_depth', 'depth'], 0);

      // optional: default these dimensions to 1
      this.in_sx = getopt(opt, ['in_sx', 'out_sx', 'sx', 'width'], 1);
      this.in_sy = getopt(opt, ['in_sy', 'out_sy', 'sy', 'height'], 1);

      this.updateDimensions();
    }
    
    forward (V, is_training) {
      this.in_act = V;
      this.out_act = V;
      return this.out_act; // simply identity function for now
    }

    backward() {}
  }
}