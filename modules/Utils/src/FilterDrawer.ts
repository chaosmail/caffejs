/// <reference path="../../Net/index.ts" />
/// <reference path="../../ImgJS/index.ts" />

namespace Utils {
  
  import jil = ImgJS;

  export class FilterDrawer extends Net.Net {

    constructor() {
      super();
    }

    render(element) {
      // Clean
      var $elem = d3.select(element);
      $elem.selectAll('*').remove();

      this.layerIterator(function(layer){
        $elem.append('h3')
          .text("Layer type: " + layer.name);
        
        var $div = $elem.append('div')
          .attr('class', 'net-layer');

        var $info = $div.append('div')
          .attr('class', 'net-description');
        
        var $vis = $div.append('div')
          .attr('class', 'net-vis');

        var $weights = $vis.append('div')
          .attr('class', 'net-weights');

        var $activations = $vis.append('div')
          .attr('class', 'net-activations');
        
        $info.append('span')
          .text(layer.layer_type);  

        for (let i=0, len=layer.out_act.depth; i<len; ++i){
          let $canv: any = $activations.append('canvas');
          jil.Image.fromFilter(layer.out_act, i, 1).render($canv[0][0]);
        }
      });
    }

    static fromNet(model: Net.Net){
      var g = new FilterDrawer;
      g.layers = model.layers;
      g.edges = model.edges;
      return g;
    }
  }
}