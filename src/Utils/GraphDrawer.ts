/// <reference path="../Net/_module.ts" />

// import * as d3 from 'd3';
// import * as dagreD3 from 'dagre-d3';

namespace Utils {
  
  // declare variables
  declare var d3: any;
  declare var dagreD3: any;

  export class GraphDrawer extends Net.Model {

    graph: any;
    $elem: any;
    $svg: any;
    $g: any;

    width: number;
    height:number;

    constructor() {
      super();
    }

    render(element, width?, height?) {
      // Create the renderer
      var render = new dagreD3.render();
      this.graph = this.createGraph();

      // Clean
      this.$elem = d3.select(element);
      this.$elem.selectAll('*').remove();

      // Run the renderer. This is what draws the final graph.
      this.$svg = this.$elem.append('svg'); 

      this.$g = this.$svg.append("g");
      render(this.$g, this.graph);

      this.width = width || this.graph.graph().width;
      this.height = height || this.graph.graph().height;

      // Center the graph
      var xOffset = (this.width - this.graph.graph().width) / 2;
      this.$g.attr("transform", "translate(" + xOffset + ")");

      this.$svg.attr('width', this.width);
      this.$svg.attr('height', this.height);

      return this;
    }

    fit() {
      // this.$g.attr("transform", "translate(" + 0 + ")");
      this.$svg.attr("viewBox", "0 0 " + this.graph.graph().width + " " + this.graph.graph().height)
      // this.$svg.attr("preserveAspectRatio", "xMinYMax meet");
      return this;
    }

    rotate() {
      var xOffset = (this.width - this.graph.graph().width) / 2;
      this.$g.attr("transform", "rotate(270) translate(" + xOffset + ")");
      this.$svg.attr("viewBox", "0 0 " + this.graph.graph().height + " " + this.graph.graph().width);
      return this;
    }

    createGraph() {
      // Create the input graph
      var g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(() => '');

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

    static fromNet(model: Net.Model){
      var g = new GraphDrawer;
      g.layers = model.layers;
      g.edges = model.edges;
      return g;
    }
  }
}
