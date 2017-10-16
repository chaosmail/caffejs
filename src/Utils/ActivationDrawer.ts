/// <reference path="../ImgJS/_module.ts" />
/// <reference path="../NumJS/_module.ts" />

//import * as d3 from 'd3';

namespace Utils {
  
  // declare variables
  declare var d3: any;
  
  const nj = NumJS;
  const im = ImgJS;

  export class ActivationDrawer extends Net.Model {

    constructor() {
      super();
    }

    render(element, renderInput: boolean = true, maxElementsPerLayer?: number, width?, height?) {
      // Clean
      var $elem = d3.select(element);
      $elem.selectAll('*').remove();

      this.layerIterator(function(layer, j){

        if (!renderInput && j == 0) {
          return;
        }

        $elem.append('h5').text(layer.name);
        
        var $div = $elem.append('div')
          .attr('class', 'net-layer');
        
        var $vis = $div.append('div')
          .attr('class', 'net-vis');

        var $weights = $vis.append('div')
          .attr('class', 'net-weights');

        var $activations = $vis.append('div')
          .attr('class', 'net-activations');

        for (let i=0, len=layer.out_act.depth; i<len; ++i){
          if (maxElementsPerLayer && i >= maxElementsPerLayer){
            return;
          }
          let $canv: any = $activations.append('canvas');
          let A = layer.out_act;

          // if (width && height){
          //   A = A.zoom(width / A.sx, height / A.sy);
          // }

          im.Image.fromFilter(A, i, 1).render($canv[0][0]);
        }
      });
    }

    static fromNet(model: Net.Model){
      var g = new ActivationDrawer;
      g.layers = model.layers;
      g.edges = model.edges;
      return g;
    }
  }
}