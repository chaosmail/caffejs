/// <reference path="../../Net/index.ts" />

namespace Utils {
  
  export class GraphDrawer extends Net.Net {

    constructor() {
      super();
    }

    render(element, width = 600) {
      // Create the renderer
      var render = new dagreD3.render();
      var graph = this.createGraph();

      // Clean
      var $elem = d3.select(element);
      $elem.selectAll('*').remove();

      // Run the renderer. This is what draws the final graph.
      var $svg = $elem.append('svg')
        .attr('width', width); 

      var $g = $svg.append("g");
      render($g, graph);

      // Center the graph
      var xCenterOffset = (width - graph.graph().width) / 2;
      $g.attr("transform", "translate(" + xCenterOffset + ", 20)");
      $svg.attr("height", graph.graph().height + 40);
    }

    createGraph() {
      // Create the input graph
      var g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {}; });

      this.layerIterator((layer, i, pred) => {
        // var numParamsPerLayer = nj.sum(layer.getNumParameters());
        g.setNode(layer.name,  {
          labelType: "html",
          label: layer.getDescription().join('<br>'),
          class: "layer-" + layer.layer_type
        });
      });

      g.nodes().forEach(function(v) {
        var node = g.node(v);

        // Round the corners of the nodes
        node.rx = node.ry = 5;
      });

      this.edges
        .filter((edge) => edge.from !== undefined && edge.to !== undefined)
        .forEach((edge) => {
          g.setEdge(edge.from, edge.to, {
            label: this.layers.get(edge.from).getOutputShape().join('x')
          });
        });

      return g;
    }

    static fromNet(model: Net.Net){
      var g = new GraphDrawer;
      g.layers = model.layers;
      g.edges = model.edges;
      return g;
    }
  }
}