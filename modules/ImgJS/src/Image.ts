/// <reference path="../../Net/index.ts" />

namespace ImgJS {

  export class Image {

    data: Uint8ClampedArray;
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;

    constructor(public src: string){
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

    render(canvas: HTMLCanvasElement) {
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      var ctx = canvas.getContext('2d');
      var img = ctx.getImageData(0, 0, this.image.width, this.image.height);
      img.data.set(this.data);
      ctx.putImageData(img, 0, 0);
    }

    // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
    // hence we need to also convert them back to RGB
    fromVol(vol: Net.Vol, mean: any, channels = [2,1,0], aplha = 255){
      mean = mean !== undefined ? mean : [0, 0, 0];
      var w = vol.sx;
      var h = vol.sy;
      var n = w*h*4;
      var c0 = channels[0];
      var c1 = channels[1];
      var c2 = channels[2];
      var data = new Uint8ClampedArray(n);
      for (var y=0; y < h; y++){
        for (var x=0; x < w; x++){
          var pp = (y*w + x) * 4;
          var mean_0 = mean[c0] instanceof Array ? +mean[c0][y*h + x] : +mean[c0];
          var mean_1 = mean[c1] instanceof Array ? +mean[c1][y*h + x] : +mean[c1];
          var mean_2 = mean[c2] instanceof Array ? +mean[c2][y*h + x] : +mean[c2];
          data[pp + 0] = vol.get(x, y, c0) + mean_0;
          data[pp + 1] = vol.get(x, y, c1) + mean_1;
          data[pp + 2] = vol.get(x, y, c2) + mean_2;
          data[pp + 3] = aplha;
        }
      }
      this.image.width = w;
      this.image.height = h;
      this.data = data;
      return this;
    }

    // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
    // hence we need to also convert to BGR order
    // Also mean should be provided in this format
    toVol(mean: any, channels = [2,1,0]) {
      mean = mean !== undefined ? mean : [0, 0, 0];
      var w = this.image.width;
      var h = this.image.height;
      var c0 = channels[0];
      var c1 = channels[1];
      var c2 = channels[2];
      var vol = new Net.Vol(w, h, 3, 0.0);
      for (var y=0; y < h; y++){
        for (var x=0; x < w; x++){
          var pp = (y*w + x) * 4;
          var mean_0 = mean[c0] instanceof Array ? +mean[c0][y*h + x] : +mean[c0];
          var mean_1 = mean[c1] instanceof Array ? +mean[c1][y*h + x] : +mean[c1];
          var mean_2 = mean[c2] instanceof Array ? +mean[c2][y*h + x] : +mean[c2];
          vol.set(x, y, c0, this.data[pp + 0] - mean_0);
          vol.set(x, y, c1, this.data[pp + 1] - mean_1);
          vol.set(x, y, c2, this.data[pp + 2] - mean_2);
        }
      }
      return vol;
    }
  }
}