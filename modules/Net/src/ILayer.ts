namespace Net {

  export interface ILayer {
  
    in_sx: number;
    in_sy: number;
    in_depth: number;

    out_sx: number;
    out_sy: number;
    out_depth: number;

    name: string;
    layer_type: string;
    input: string;
    output: string;

    getNumParameters(): number[];
    getOutputShape(): number[];
    getDescription(): string[];
    updateDimensions(pred?: ILayer | ILayer[]);
    forward(V: Vol, is_training: boolean);
    backward(y?: Vol);
  }
}