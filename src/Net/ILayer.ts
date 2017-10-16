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

    in_act: Vol | Vol[];
    out_act: Vol;

    getNumParameters(): number[];
    getOutputShape(): number[];
    getDescription(): string[];
    updateDimensions(pred?: ILayer[]);
    forward(V: Vol, is_training: boolean);
    backward(y?: Vol);
  }
}
