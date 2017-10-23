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
    height: number;

    static readonly MIN_LAYER_HEIGHT: number = 16;
    static readonly MAX_LAYER_HEIGHT: number = 48;

    static readonly MIN_LAYER_WIDTH: number = 128;
    static readonly MAX_LAYER_WIDTH: number = 512;
    
    static readonly NODE_RADIUS: number = 4;
    static readonly LAYER_GROUP_SEP: string = '/';
    static readonly LAYER_NAME_SEP: string = '_';

    constructor(private compact: boolean = false) {
      super();
    }

    render(element, width?, height?) {
      // Create the renderer
      var render = new dagreD3.render();
      this.graph = this.compact ? this.createCompactGraph() : this.createGraph();

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
      if (xOffset) {
        this.$g.attr("transform", "translate(" + xOffset + ")");
      }

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

    getHeightScaleTemplate(exp: number = 0.25) {
      return d3.scale.pow().exponent(exp).range([GraphDrawer.MIN_LAYER_HEIGHT, GraphDrawer.MAX_LAYER_HEIGHT]).clamp(true);
    }

    getWidthScaleTemplate(exp: number = 0.75) {
      return d3.scale.pow().exponent(exp).range([GraphDrawer.MIN_LAYER_WIDTH, GraphDrawer.MAX_LAYER_WIDTH]).clamp(true);
    }

    getWidthScale() {
      var extWidth = d3.extent(this.layers.values(), d => d.getOutputShape()[1]);
      var extHeight = d3.extent(this.layers.values(), d => d.getOutputShape()[2]);

      var widthScale = this.getWidthScaleTemplate().domain([
        Math.min(extWidth[0], extHeight[0]),
        Math.max(extWidth[1], extHeight[1])
      ]);

      return function(layer) {
         var layerSize = Math.max(layer.getOutputShape()[1], layer.getOutputShape()[2]);
         return widthScale(layerSize);
      };
    }

    getHeightScale() {
      var extDepth = d3.extent(this.layers.values(), d => d.getOutputShape()[0]);
      
      var heightScale = this.getHeightScaleTemplate().domain([
        extDepth[0], extDepth[1]
      ]);

      return function(layer) {
         var layerDepth = layer.getOutputShape()[0];
         return heightScale(layerDepth);
      };
    }

    createCompactGraph() {

      var g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(() => '');

      var getWidth = this.getWidthScale();
      var getHeight = this.getHeightScale();

      var take = (desc, k) => desc.splice(k, 1);
      var skip = (desc, k) => desc.filter((d, i) => i !== k);
      var after = (d, f) => d != "" ? d + f : d;
      var before = (d, f) => d != "" ? f + d : d;
      var emph = (d) => "<strong>" + d + "</strong>";

      var paramsFormat = d3.format('s');

      var getNumParams = function(layerGroup) {
        var numParams = d3.sum(layerGroup.values, d => d3.sum(d.getNumParameters()));
        return numParams ? after(paramsFormat(numParams), " parameters") : "";
      };

      var getCompactLabel = function(layerGroup) {
        if (layerGroup.values.length === 1) {
          return layerGroup.values.map(d => emph(d.getDescription()[0]))[0];
        }
        else if (layerGroup.values.length <= 5) {
          return layerGroup.values.map(d => emph(d.getDescription()[0])).join(" + ");
        }
        return emph(layerGroup.key.split(GraphDrawer.LAYER_NAME_SEP)[0].toUpperCase());
      }

      var getCompactClass = function(layerGroup) {
        if (layerGroup.values.length === 1) {
          return layerGroup.values[0].layer_type;
        }
        else if (layerGroup.values.length <= 5) {
          return layerGroup.values[0].layer_type;
        }
        return layerGroup.key.split(GraphDrawer.LAYER_NAME_SEP)[0].replace(/\d/g, '');
      }

      var layers = d3.nest()
        .key(d => d.name.split(GraphDrawer.LAYER_GROUP_SEP)[0])
        .entries(this.layers.values());

      layers.forEach(function(layer, i){
        var lastLayer = layer.values[layer.values.length - 1];
        
        g.setNode(layer.key,  {
          labelType: "html",
          label: getCompactLabel(layer) + before(getNumParams(layer), "<br>"),
          class: "layer layer-" + getCompactClass(layer),
          width: getWidth(lastLayer),
          height: getHeight(lastLayer)
        });

        if (i > 0) {
          var prev = layers[i - 1];
          var prevLayer = prev.values[prev.values.length - 1];

          g.setEdge(prev.key, layer.key, {
            label: prevLayer.getOutputShape().join('x'),
            class: "edge"
          });
        }
      });

      return GraphDrawer.addRoundCorners(g);
    }

    createGraph() {
       
      var emph = (arr, j) => arr.map((d, i) => i === j ? "<strong>" + d + "</strong>" : d);

      var getWidth = this.getWidthScale();

      // Create the input graph
      var g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(() => '');

      this.layerIterator((layer, i, pred) => {
        // var numParamsPerLayer = nj.sum(layer.getNumParameters());
        g.setNode(layer.name,  {
          labelType: "html",
          label: emph(layer.getDescription(), 0).join('<br>'),
          class: "layer layer-" + layer.layer_type,
          width: getWidth(layer)
        });
      });

      this.edges
        .filter((edge) => edge.from !== undefined && edge.to !== undefined)
        .forEach((edge) => {
          g.setEdge(edge.from, edge.to, {
            label: this.layers.get(edge.from).getOutputShape().join('x'),
            class: "edge"
          });
        });

      return GraphDrawer.addRoundCorners(g);
    }

    static addRoundCorners(graph) {
      graph.nodes().forEach(function(v) {
        var node = graph.node(v);

        // Round the corners of the nodes
        node.rx = node.ry = GraphDrawer.NODE_RADIUS;
      });
      return graph;
    }

    static fromNet(model: Net.Model, compact: boolean = false){
      var g = new GraphDrawer(compact);
      g.layers = model.layers;
      g.edges = model.edges;
      return g;
    }
  }
}
