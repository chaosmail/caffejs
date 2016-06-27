/// <reference path="../../NumJS/index.ts" />

namespace Net {

  import nj = NumJS;

  interface IEdge {
    from: string;
    to: string;
  }

  export class Net {

    public layers: d3.Map<ILayer>;
    public edges: IEdge[];

    constructor(){

    }

    getLayer(name: string): ILayer {
      return this.layers.get(name);
    }

    setInputDimensions(width: number, height: number, depth: number = 3) {
      this.layerIterator((layer: ILayer, i: number, pred: ILayer[]) => {
        if (i === 0) {
          layer.in_sx = width;
          layer.in_sy= height;
          layer.in_depth = depth;
          layer.updateDimensions();
        }
        else {
          layer.updateDimensions(pred);
        }
      });
    }

    layerIterator(iteratorFn: (layer: ILayer, i: number, pred: ILayer[]) => any, params: any = {}) {
      var layerStack: ILayer[] = [];
      var edges: IEdge[] = [];
      var layer: ILayer;
      var i = 0;

      // Store the visited nodes
      var visited = d3.set();

      // Forward traversal
      if (params.reverse === undefined || params.reverse === false) {
        // Define the current layer
        layer = params.start ? this.layers.get(params.start) : this.layers.get('data');
        edges = this.edges;
      }
      // Backward traversal
      else {
        // Define the current layer
        layer = params.start ? this.layers.get(params.start) : this.layers.values()[this.layers.size() - 1];
        edges = this.edges.map((d: IEdge) => {
          return { from: d.to, to: d.from }
        });
      }

      // Aggregate all edges by the from property
      // Reverse edge directions
      var edgesFrom = d3.map(
        d3.nest()
          .key((d: IEdge) => d.from)
          .entries(edges), (d) => d.key);

      // Aggregate all edges by the to property
      // Reverse edge directions
      var edgesTo = d3.map(
        d3.nest()
          .key((d: IEdge) => d.to)
          .entries(edges), (d) => d.key);

      // Start with the first layer
      layerStack.push(layer);

      while (layerStack.length) {
        // Take a layer from the stack
        let layer = layerStack.pop();
        
        // Set the layer visited
        visited.add(layer.name);

        // Collect the previous Layers
        var parentKeys = edgesTo.get(layer.name);
        var parents = parentKeys === undefined ? undefined
          : parentKeys.values.map((d) => this.layers.get(d.from));

        // Call the iterator callback
        iteratorFn(layer, i++, parents);
        
        // Check if we reached the end layer
        if (params.end && layer.name === params.end) {
          break;
        }

        // Get all children for this layer
        var childrenKeys = edgesFrom.get(layer.name);
        if (childrenKeys) {
          childrenKeys.values
            // Only check adjacent nodes that have
            // not been visited yet
            .filter((d) => !visited.has(d.to))
            .forEach((d) => {
              // Check if there are still any unvisited parents
              // of the next child which need to be visited first
              var parentKeysOfChild = edgesTo.get(d.to);
              var unvisitedParents = parentKeysOfChild === undefined ? []
                : parentKeysOfChild.values.filter((d) => !visited.has(d.from));

              // All previous parents have been visited
              if (unvisitedParents.length === 0) {
                // Add the layer to the stack
                layerStack.push(this.layers.get(d.to));
              }
            });
        }
      }
    }

    forward(V, is_training = false, params: any = {}) {
      var activationMap = d3.map();
      var currentActivation;
      this.layerIterator((layer, i, parents) => {  
        if (parents === undefined) {
          currentActivation = V;
        }
        else if (parents.length > 1) {
          currentActivation = parents.map((d) => activationMap.get(d.name));
        }
        else {
          currentActivation = activationMap.get(parents[0].name);
        }
        currentActivation = layer.forward(currentActivation, is_training);  
        activationMap.set(layer.name, currentActivation);
      }, params);

      return currentActivation;
    }

    backward(y, params: any = {}) {
      params.reverse = true;

      var loss;

      this.layerIterator((layer, i, parents) => {  
        if (y !== undefined && i === 0) {
          // last layer assumed to be loss layer
          loss = layer.backward(y);
        }
        else {
          // backprop to all other layers
          layer.backward();
        }
      }, params);

      return loss;
    }

    debugStructure(){
      var numParams = 0;
      var f = d3.format('s')
      var f2 = d3.format(',d')
      var numLayers = 0;

      this.layerIterator((layer, i, pred) => {
        var numParamsPerLayer = nj.sum(layer.getNumParameters());

        var str = "";
        str += layer.getOutputShape().join('x') + " :: ";
        str += layer.getDescription().join(' ');

        if (numParamsPerLayer) {
          numParams += numParamsPerLayer;
          str += " => " + f2(numParamsPerLayer) + ' parameters';
        }

        //if (['relu', 'tanh', 'sigmoid'].indexOf(layer.layer_type) === -1) {
          numLayers += 1;
          console.log(str);
        //}
      });

      console.log('---')
      console.log('Total number of layers ' + f2(numLayers));
      console.log('Total number of params ' + f2(numParams) + ' (memory: ' + f(numParams*4) + 'b): ');
    }
  }
}