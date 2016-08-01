/// <reference path="../../Net/index.ts" />

namespace ImgJS {

  import nj = NumJS;

  export class Image {

    data: Uint8ClampedArray;
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;

    constructor(public src?: string){
      this.canvas = document.createElement('canvas');
      this.image = document.createElement('img');
    }

    set(imgData: ImageData) {
      this.data = imgData.data;
      this.image.width = imgData.width;
      this.image.height = imgData.height;
      return this;
    }

    load() {
      return new Promise((resolve, reject) => {
        var ctx = this.canvas.getContext('2d');
        this.image.onload = () => {
          (<any>ctx).imageSmoothingEnabled = false;
          this.canvas.width = this.image.width;
          this.canvas.height = this.image.height;
          
          ctx.drawImage(this.image, 0, 0);
          var imgData = ctx.getImageData(0, 0, this.image.width, this.image.height);
          this.data = imgData.data;
          
          resolve(this.data);
        };
        this.image.src = this.src;
      });
    }

    render(canvas?: HTMLCanvasElement) {
      if (canvas === undefined) {
        canvas = this.canvas;
        document.body.appendChild(canvas);
      }
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      var ctx = canvas.getContext('2d');
      (<any>ctx).imageSmoothingEnabled = false;
      var img = ctx.getImageData(0, 0, this.image.width, this.image.height);
      img.data.set(this.data);
      ctx.putImageData(img, 0, 0);
    }

    static fromMean(vol: Net.Vol, depth = 0, scale = 1, normalize = false) {
      return Image.fromVol(vol, 0, [0,1,2], scale, normalize);
    }

    static fromFilter(vol: Net.Vol, depth = 0, scale = 1, normalize = true) {
      return Image.fromVol(vol, 0, depth, scale, normalize);
    }

    // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
    // hence we need to also convert them back to RGB
    static fromVol(vol: Net.Vol, mean: any, channel: number | number[] = [2,1,0], scale = 1, normalize = false, aplha = 255){
      var img = new Image();
      mean = mean !== undefined ? mean : [0, 0, 0];
      
      var w = vol.sx;
      var h = vol.sy;
      var n = w*h*4;
      var mm = nj.maxmin(vol.w);

      var c0 = channel ? channel instanceof Array ? channel[0] : +channel : 0;
      var c1 = channel ? channel instanceof Array ? channel[1] : +channel : 0;
      var c2 = channel ? channel instanceof Array ? channel[2] : +channel : 0;
      
      var data = new Uint8ClampedArray(n);
      
      for (let y=0; y < h; y++){
        for (let x=0; x < w; x++){
          let pp = (y*w + x) * 4;
          let mean_0 = mean ? mean instanceof Net.Vol ? mean.get(x,y,c0) : +mean[c0] : 0;
          let mean_1 = mean ? mean instanceof Net.Vol ? mean.get(x,y,c1) : +mean[c1] : 0;
          let mean_2 = mean ? mean instanceof Net.Vol ? mean.get(x,y,c2) : +mean[c2] : 0;
          let dval_0 = vol.get(x, y, c0);
          let dval_1 = vol.get(x, y, c1);
          let dval_2 = vol.get(x, y, c2);
          if (normalize) {
            dval_0 = Math.floor((vol.get(x, y, c0) - mm.minv) / mm.dv * 255);
            dval_1 = Math.floor((vol.get(x, y, c1) - mm.minv) / mm.dv * 255);
            dval_2 = Math.floor((vol.get(x, y, c2) - mm.minv) / mm.dv * 255);  
          }
          data[pp + 0] = dval_0 + mean_0;
          data[pp + 1] = dval_1 + mean_1;
          data[pp + 2] = dval_2 + mean_2;
          data[pp + 3] = aplha;
        }
      }
      img.image.width = w;
      img.image.height = h;
      img.data = data;
      return img;
    }

    // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
    // hence we need to also convert to BGR order
    // Also mean should be provided in this format
    toVol(mean: any, channel = [2,1,0]) {
      mean = mean !== undefined ? mean : [0, 0, 0];
      var w = this.image.width;
      var h = this.image.height;
      var c0 = channel[0];
      var c1 = channel[1];
      var c2 = channel[2];
      var vol = new Net.Vol(w, h, 3, 0.0);
      for (var y=0; y < h; y++){
        for (var x=0; x < w; x++){
          var pp = (y*w + x) * 4;
          var mean_0 = mean instanceof Net.Vol ? mean.get(x,y,c0) : +mean[c0];
          var mean_1 = mean instanceof Net.Vol ? mean.get(x,y,c1) : +mean[c1];
          var mean_2 = mean instanceof Net.Vol ? mean.get(x,y,c2) : +mean[c2];
          vol.set(x, y, c0, this.data[pp + 0] - mean_0);
          vol.set(x, y, c1, this.data[pp + 1] - mean_1);
          vol.set(x, y, c2, this.data[pp + 2] - mean_2);
        }
      }
      return vol;
    }
  }
}