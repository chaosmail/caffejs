# CaffeJS

This repo is a proof of concept for porting Caffe models to the browser using ConvNetJS (by Andrej Karpathy). It aims to help beginners to dive into Deep Neural Networks by using only a browser.

This work is pre-alpha and based on ConvNetJS (which is alpha), so you can imagine how much I need your help!

## Getting Started

To run the samples, please execute `npm start` from the root directory. Make sure you updated all dependencies by running `npm install` beforehand.

### Running CaffeJS

> Please note, that the ConvNetJS library in this repo is a [fork](https://github.com/chaosmail/convnetjs) of the original version.

Clone the repository to your local drive and then start a static webserver in the root directory (e.g. run `npm start`). Now you can open `models.html` that loads and visualizes popular deep learning architectures (such as AlexNet, VGG, GoogLeNet, etc.) to analyze their structure. This loads and parses the Caffe models from `.prototxt` files and convert them on-the-fly to ConvNetJS models.

To run a forward pass we need to load some pretrained model weights. You can use the script `scripts/convert_caffemodel.py` to convert `*.caffemodel` files to binary blobs. Unfortunately, you need to have `Caffe` and `pycaffe` installed (which is a pain) to generate those files (for now). However, I will host small model weights directly in this repo - or publish them via Dropbox.

### Loading the labels

Ỳou can load the ImageNet labels from the data directory, using the following snippet.

```js
var labels;
d3.text('data/ilsvrc12/synset_words.txt', function(data){
  labels = data.split('\n').map(function(d){
    return d.substr(10);
  });
});
```

### Using the `mean.binaryproto` values

To use the `mean.binaryproto` values in CaffeJS, we need to parse the binary files into Volumes. First, we need to include to Protobuf specific libraries in the header.

```html
<script src="libs/long.min.js"></script>
<script src="libs/bytebuffer.min.js"></script>
<script src="libs/protobuf.min.js"></script>
```

Now we can use the `BlobProtoParser` to transform the binary file into a Volume.

```js
var mean;
var p = new Parser.BlobProtoParser();
p.parse('models/age_net/mean.binaryproto').then(function(data){
  mean = data;
});
```

You can debug the mean values by rendering the Volume to the screen. Add the following line to the callback function to render the Volume to a Canvas.

```js
ImgJS.Image.fromMean(mean).render();
```

## Examples

To run the samples, please execute `npm start` from the root directory. Make sure you updated all dependencies by running `npm install` beforehand.

### Analyze Deep Learning structures

[The sample `examples/models.html`](https://chaosmail.github.io/caffejs/models.html) loads famous Deep Learning Models such as AlexNet, VGG, GoogLeNet, etc. directly in your browser and visualizes the layer graph. It also analyzes their structure and prints detailed information such as the network dimension, number of parameters and network size in memory to the console.

Here is a break-down of **AlexNet** computed with CaffeJS.

> the dimensions on the left side define the output dimensions of the current layer `d, h, w`. The memory size is computed using Float32 (4 byte).

```
3x227x227 :: INPUT data
96x55x55 :: CONV conv1 96x11x11 Stride 4 Pad 0 => 34,944 parameters
96x55x55 :: RELU relu1
96x55x55 :: LRN norm1 alpha 0.0001 beta 0.75 k 1 n 5
96x27x27 :: MAX POOL pool1 3x3 Stride 2 Pad 0
256x27x27 :: CONV conv2 256x5x5 Stride 1 Pad 2 => 614,656 parameters
256x27x27 :: RELU relu2
256x27x27 :: LRN norm2 alpha 0.0001 beta 0.75 k 1 n 5
256x13x13 :: MAX POOL pool2 3x3 Stride 2 Pad 0
384x13x13 :: CONV conv3 384x3x3 Stride 1 Pad 1 => 885,120 parameters
384x13x13 :: RELU relu3
384x13x13 :: CONV conv4 384x3x3 Stride 1 Pad 1 => 1,327,488 parameters
384x13x13 :: RELU relu4
256x13x13 :: CONV conv5 256x3x3 Stride 1 Pad 1 => 884,992 parameters
256x13x13 :: RELU relu5
256x6x6 :: MAX POOL pool5 3x3 Stride 2 Pad 0
4096x1x1 :: FC fc6 => 37,752,832 parameters
4096x1x1 :: DROPOUT drop6
4096x1x1 :: RELU relu6
4096x1x1 :: FC fc7 => 16,781,312 parameters
4096x1x1 :: DROPOUT drop7
4096x1x1 :: RELU relu7
1000x1x1 :: FC fc8 => 4,097,000 parameters
1000x1x1 :: SOFTMAX prob
---
Total number of layers 24
Total number of params 62,378,344 (memory: 249.513376Mb): 
```

Here is a break-down of **GoogLeNet** computed with CaffeJS (please note, that the layers of each inception module are not sequential as shown here but parallel).

```
3x224x224 :: INPUT data
64x113x113 :: CONV conv1/7x7_s2 64x7x7 Stride 2 Pad 3 => 9,472 parameters
64x113x113 :: RELU conv1/relu_7x7
64x56x56 :: MAX POOL pool1/3x3_s2 3x3 Stride 2 Pad 0
64x56x56 :: LRN pool1/norm1 alpha 0.0001 beta 0.75 k 1 n 5
64x56x56 :: CONV conv2/3x3_reduce 64x1x1 Stride 1 Pad 0 => 4,160 parameters
64x56x56 :: RELU conv2/relu_3x3_reduce
192x56x56 :: CONV conv2/3x3 192x3x3 Stride 1 Pad 1 => 110,784 parameters
192x56x56 :: RELU conv2/relu_3x3
192x56x56 :: LRN conv2/norm2 alpha 0.0001 beta 0.75 k 1 n 5
192x28x28 :: MAX POOL pool2/3x3_s2 3x3 Stride 2 Pad 0
192x28x28 :: MAX POOL inception_3a/pool 3x3 Stride 1 Pad 1
32x28x28 :: CONV inception_3a/pool_proj 32x1x1 Stride 1 Pad 0 => 6,176 parameters
32x28x28 :: RELU inception_3a/relu_pool_proj
16x28x28 :: CONV inception_3a/5x5_reduce 16x1x1 Stride 1 Pad 0 => 3,088 parameters
16x28x28 :: RELU inception_3a/relu_5x5_reduce
32x28x28 :: CONV inception_3a/5x5 32x5x5 Stride 1 Pad 2 => 12,832 parameters
32x28x28 :: RELU inception_3a/relu_5x5
96x28x28 :: CONV inception_3a/3x3_reduce 96x1x1 Stride 1 Pad 0 => 18,528 parameters
96x28x28 :: RELU inception_3a/relu_3x3_reduce
128x28x28 :: CONV inception_3a/3x3 128x3x3 Stride 1 Pad 1 => 110,720 parameters
128x28x28 :: RELU inception_3a/relu_3x3
64x28x28 :: CONV inception_3a/1x1 64x1x1 Stride 1 Pad 0 => 12,352 parameters
64x28x28 :: RELU inception_3a/relu_1x1
256x28x28 :: CONCAT inception_3a/output
256x28x28 :: MAX POOL inception_3b/pool 3x3 Stride 1 Pad 1
64x28x28 :: CONV inception_3b/pool_proj 64x1x1 Stride 1 Pad 0 => 16,448 parameters
64x28x28 :: RELU inception_3b/relu_pool_proj
32x28x28 :: CONV inception_3b/5x5_reduce 32x1x1 Stride 1 Pad 0 => 8,224 parameters
32x28x28 :: RELU inception_3b/relu_5x5_reduce
96x28x28 :: CONV inception_3b/5x5 96x5x5 Stride 1 Pad 2 => 76,896 parameters
96x28x28 :: RELU inception_3b/relu_5x5
128x28x28 :: CONV inception_3b/3x3_reduce 128x1x1 Stride 1 Pad 0 => 32,896 parameters
128x28x28 :: RELU inception_3b/relu_3x3_reduce
192x28x28 :: CONV inception_3b/3x3 192x3x3 Stride 1 Pad 1 => 221,376 parameters
192x28x28 :: RELU inception_3b/relu_3x3
128x28x28 :: CONV inception_3b/1x1 128x1x1 Stride 1 Pad 0 => 32,896 parameters
128x28x28 :: RELU inception_3b/relu_1x1
480x28x28 :: CONCAT inception_3b/output
480x14x14 :: MAX POOL pool3/3x3_s2 3x3 Stride 2 Pad 0
480x14x14 :: MAX POOL inception_4a/pool 3x3 Stride 1 Pad 1
64x14x14 :: CONV inception_4a/pool_proj 64x1x1 Stride 1 Pad 0 => 30,784 parameters
64x14x14 :: RELU inception_4a/relu_pool_proj
16x14x14 :: CONV inception_4a/5x5_reduce 16x1x1 Stride 1 Pad 0 => 7,696 parameters
16x14x14 :: RELU inception_4a/relu_5x5_reduce
48x14x14 :: CONV inception_4a/5x5 48x5x5 Stride 1 Pad 2 => 19,248 parameters
48x14x14 :: RELU inception_4a/relu_5x5
96x14x14 :: CONV inception_4a/3x3_reduce 96x1x1 Stride 1 Pad 0 => 46,176 parameters
96x14x14 :: RELU inception_4a/relu_3x3_reduce
208x14x14 :: CONV inception_4a/3x3 208x3x3 Stride 1 Pad 1 => 179,920 parameters
208x14x14 :: RELU inception_4a/relu_3x3
192x14x14 :: CONV inception_4a/1x1 192x1x1 Stride 1 Pad 0 => 92,352 parameters
192x14x14 :: RELU inception_4a/relu_1x1
512x14x14 :: CONCAT inception_4a/output
512x14x14 :: MAX POOL inception_4b/pool 3x3 Stride 1 Pad 1
64x14x14 :: CONV inception_4b/pool_proj 64x1x1 Stride 1 Pad 0 => 32,832 parameters
64x14x14 :: RELU inception_4b/relu_pool_proj
24x14x14 :: CONV inception_4b/5x5_reduce 24x1x1 Stride 1 Pad 0 => 12,312 parameters
24x14x14 :: RELU inception_4b/relu_5x5_reduce
64x14x14 :: CONV inception_4b/5x5 64x5x5 Stride 1 Pad 2 => 38,464 parameters
64x14x14 :: RELU inception_4b/relu_5x5
112x14x14 :: CONV inception_4b/3x3_reduce 112x1x1 Stride 1 Pad 0 => 57,456 parameters
112x14x14 :: RELU inception_4b/relu_3x3_reduce
224x14x14 :: CONV inception_4b/3x3 224x3x3 Stride 1 Pad 1 => 226,016 parameters
224x14x14 :: RELU inception_4b/relu_3x3
160x14x14 :: CONV inception_4b/1x1 160x1x1 Stride 1 Pad 0 => 82,080 parameters
160x14x14 :: RELU inception_4b/relu_1x1
512x14x14 :: CONCAT inception_4b/output
512x14x14 :: MAX POOL inception_4c/pool 3x3 Stride 1 Pad 1
64x14x14 :: CONV inception_4c/pool_proj 64x1x1 Stride 1 Pad 0 => 32,832 parameters
64x14x14 :: RELU inception_4c/relu_pool_proj
24x14x14 :: CONV inception_4c/5x5_reduce 24x1x1 Stride 1 Pad 0 => 12,312 parameters
24x14x14 :: RELU inception_4c/relu_5x5_reduce
64x14x14 :: CONV inception_4c/5x5 64x5x5 Stride 1 Pad 2 => 38,464 parameters
64x14x14 :: RELU inception_4c/relu_5x5
128x14x14 :: CONV inception_4c/3x3_reduce 128x1x1 Stride 1 Pad 0 => 65,664 parameters
128x14x14 :: RELU inception_4c/relu_3x3_reduce
256x14x14 :: CONV inception_4c/3x3 256x3x3 Stride 1 Pad 1 => 295,168 parameters
256x14x14 :: RELU inception_4c/relu_3x3
128x14x14 :: CONV inception_4c/1x1 128x1x1 Stride 1 Pad 0 => 65,664 parameters
128x14x14 :: RELU inception_4c/relu_1x1
512x14x14 :: CONCAT inception_4c/output
512x14x14 :: MAX POOL inception_4d/pool 3x3 Stride 1 Pad 1
64x14x14 :: CONV inception_4d/pool_proj 64x1x1 Stride 1 Pad 0 => 32,832 parameters
64x14x14 :: RELU inception_4d/relu_pool_proj
32x14x14 :: CONV inception_4d/5x5_reduce 32x1x1 Stride 1 Pad 0 => 16,416 parameters
32x14x14 :: RELU inception_4d/relu_5x5_reduce
64x14x14 :: CONV inception_4d/5x5 64x5x5 Stride 1 Pad 2 => 51,264 parameters
64x14x14 :: RELU inception_4d/relu_5x5
144x14x14 :: CONV inception_4d/3x3_reduce 144x1x1 Stride 1 Pad 0 => 73,872 parameters
144x14x14 :: RELU inception_4d/relu_3x3_reduce
288x14x14 :: CONV inception_4d/3x3 288x3x3 Stride 1 Pad 1 => 373,536 parameters
288x14x14 :: RELU inception_4d/relu_3x3
112x14x14 :: CONV inception_4d/1x1 112x1x1 Stride 1 Pad 0 => 57,456 parameters
112x14x14 :: RELU inception_4d/relu_1x1
528x14x14 :: CONCAT inception_4d/output
528x14x14 :: MAX POOL inception_4e/pool 3x3 Stride 1 Pad 1
128x14x14 :: CONV inception_4e/pool_proj 128x1x1 Stride 1 Pad 0 => 67,712 parameters
128x14x14 :: RELU inception_4e/relu_pool_proj
32x14x14 :: CONV inception_4e/5x5_reduce 32x1x1 Stride 1 Pad 0 => 16,928 parameters
32x14x14 :: RELU inception_4e/relu_5x5_reduce
128x14x14 :: CONV inception_4e/5x5 128x5x5 Stride 1 Pad 2 => 102,528 parameters
128x14x14 :: RELU inception_4e/relu_5x5
160x14x14 :: CONV inception_4e/3x3_reduce 160x1x1 Stride 1 Pad 0 => 84,640 parameters
160x14x14 :: RELU inception_4e/relu_3x3_reduce
320x14x14 :: CONV inception_4e/3x3 320x3x3 Stride 1 Pad 1 => 461,120 parameters
320x14x14 :: RELU inception_4e/relu_3x3
256x14x14 :: CONV inception_4e/1x1 256x1x1 Stride 1 Pad 0 => 135,424 parameters
256x14x14 :: RELU inception_4e/relu_1x1
832x14x14 :: CONCAT inception_4e/output
832x7x7 :: MAX POOL pool4/3x3_s2 3x3 Stride 2 Pad 0
832x7x7 :: MAX POOL inception_5a/pool 3x3 Stride 1 Pad 1
128x7x7 :: CONV inception_5a/pool_proj 128x1x1 Stride 1 Pad 0 => 106,624 parameters
128x7x7 :: RELU inception_5a/relu_pool_proj
32x7x7 :: CONV inception_5a/5x5_reduce 32x1x1 Stride 1 Pad 0 => 26,656 parameters
32x7x7 :: RELU inception_5a/relu_5x5_reduce
128x7x7 :: CONV inception_5a/5x5 128x5x5 Stride 1 Pad 2 => 102,528 parameters
128x7x7 :: RELU inception_5a/relu_5x5
160x7x7 :: CONV inception_5a/3x3_reduce 160x1x1 Stride 1 Pad 0 => 133,280 parameters
160x7x7 :: RELU inception_5a/relu_3x3_reduce
320x7x7 :: CONV inception_5a/3x3 320x3x3 Stride 1 Pad 1 => 461,120 parameters
320x7x7 :: RELU inception_5a/relu_3x3
256x7x7 :: CONV inception_5a/1x1 256x1x1 Stride 1 Pad 0 => 213,248 parameters
256x7x7 :: RELU inception_5a/relu_1x1
832x7x7 :: CONCAT inception_5a/output
832x7x7 :: MAX POOL inception_5b/pool 3x3 Stride 1 Pad 1
128x7x7 :: CONV inception_5b/pool_proj 128x1x1 Stride 1 Pad 0 => 106,624 parameters
128x7x7 :: RELU inception_5b/relu_pool_proj
48x7x7 :: CONV inception_5b/5x5_reduce 48x1x1 Stride 1 Pad 0 => 39,984 parameters
48x7x7 :: RELU inception_5b/relu_5x5_reduce
128x7x7 :: CONV inception_5b/5x5 128x5x5 Stride 1 Pad 2 => 153,728 parameters
128x7x7 :: RELU inception_5b/relu_5x5
192x7x7 :: CONV inception_5b/3x3_reduce 192x1x1 Stride 1 Pad 0 => 159,936 parameters
192x7x7 :: RELU inception_5b/relu_3x3_reduce
384x7x7 :: CONV inception_5b/3x3 384x3x3 Stride 1 Pad 1 => 663,936 parameters
384x7x7 :: RELU inception_5b/relu_3x3
384x7x7 :: CONV inception_5b/1x1 384x1x1 Stride 1 Pad 0 => 319,872 parameters
384x7x7 :: RELU inception_5b/relu_1x1
1024x7x7 :: CONCAT inception_5b/output
1024x1x1 :: AVE POOL pool5/7x7_s1 7x7 Stride 1 Pad 0
1024x1x1 :: DROPOUT pool5/drop_7x7_s1
1000x1x1 :: FC loss3/classifier => 1,025,000 parameters
1000x1x1 :: SOFTMAX prob
---
Total number of layers 143
Total number of params 6,998,552 (memory: 27.994208Mb): 
```

Please note that these samples don't load the networks' weights but only the structure with default initialization.

### Classification using GoogLeNet

[The demo `examples/webcam.html`](https://chaosmail.github.io/caffejs/webcam.html) uses the pretrained GoogLeNet model from Caffe (trained on ImageNet) to perform classification entirely in your browser using images from your webcam.

### DeepDream

[The `examples/deepdream.html`](https://chaosmail.github.io/caffejs/deepdream.html) is a cool example that runs the famous [DeepDream](https://github.com/google/deepdream/blob/master/dream.ipynb) demo entirely in your browser - entirely in JavaScript of course. It uses the pretrained GoogLeNet from Caffe and runs the computation as webworker.

> Debugging this demo: Go to the `Sources` panel in the Chrome Developer Tools and load the demo. You should see a webworker icon entitled with `deepdream_worker.js`. You can click on it and set your breakpoints as usual. Additionally, you could enable `DevTools for Services Workers` in the `Resources` panel.

## Development

Please make sure you have Gulp, Typescript and Typings installed.

`npm install -g gulp-cli typescript typings`

### Getting Started

Checkout the project and run `npm install` in the root directory to get started. Now you can start diving into the code.

You can build your code running `gulp` or using the file watcher `gulp watch`.

### Organization of the Code

This library uses Typescript to modularize JavaScript code and use some of the cool Typescript features on top, such as classes, inheritance, fat arrow functions, etc.

You can find the source code in the `modules/` directory where I organize in 5 modules:

* Net - The fork of ConvNetJS, containing the convnet model, the Volume implementation and the layers
* ImgJS - An image abstraction for JavaScript to avoid dealing with canvas elements and facilitate conversion to Volumes
* NumJS - An abstraction for operations on Arrays and Volumes
* Parser - A parser for converting Prototxt into JavaScript objects
* Utils - Cool abstractions for visualizations, such as the GraphDrawer and FilterDrawer

### What's left to do

* Debug and fix remaining issues with SoftMax layer
* Debug and fix AlexNet
* Implement AVE pooling backward pass
* Implement more layers and missing parameters: some models need special layers, like elementwise sum, or convolution groups etc.
* Extract weights directly from *.caffemodel file (without converting to intermediate binary format)
* Nice documentation and more samples
* Write tests
* Rename FilterDrawer to ActivationDrawer, implement FilterDrawer to visualize filters
* Auto-scale the filters and activations to a meaningful output dimension
* Publish weights on Dropbox, and make them download script using curl
* Add a nice layout, docs and example page

## License

The software is provided under MIT license.