# CaffeJS (not quite)

This repo is a proof of concept for porting Caffe models to the browser using ConvNetJS (by Andrej Karpathy). It aims to help beginners to dive into Deep Neural Networks by using only a browser.

This work is pre-alpha and based on ConvNetJS (which is alpha), so you can imagine how much I need your help!

## Getting Started

### Running CaffeJS

> Please note, that the ConvNetJS library in this repo is a [fork](https://github.com/chaosmail/convnetjs) of the original version. It's not updated yet, please be patient.

Clone the repository to your local drive and then start a static webserver in the root directory (e.g. run `http-server`). Now you can open the `00_*model.html` samples that load popular deep learning architectures (such as AlexNet, VGG, GoogLeNet, etc.) and analyze their structure. They actually load the Caffe models from `.prototxt` files and convert them on-the-fly to ConvNetJS models.

To run a forward pass we need to load some pretrained model weights. You can use the files `weights_to_json.py` and `weights_to_txt.py` to convert `*.caffemodel` files to JSON or TXT weights. Unfortunately, you need to have `Caffe` and `pycaffe` installed (which is a pain). However, I plan to host the ConvNetJS models on Dropbox as soon as we have found an acceptable format.

You can as well convert mean files using `python2 convert_protomean.py data/models/VGG_CNN_S/VGG_mean.binaryproto data/models/VGG_CNN_S/VGG_mean.txt` - however I will always provide the mean TXT files in the repo.

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

### Converting RGB to conventjs.Vol

First make sure you have loaded the proper mean values for your dataset.

```js
var mean;
d3.text('data/ilsvrc12/imagenet_mean.txt', function(data){
  mean = data.split('\n').map(function(d){
    return d.split(',');
  });
});
```

Now open a stream from your webcam and convert it to convnetjs.Vol

```js
var cam = new Camera('.camera', width, height);

cam.on('stream', function(img){
  var input = rgb2vol(img, mean);
  
});
```

> Please be aware that Caffe uses OpenCV to load the image files, which keeps them in BGR color space (not RGB). The `rgb2vol` method converts your data (extracted from Canvas) into BGR space and subtracts the mean at the same time. 

### Performing a Forward Pass

Finally you can perform a forward pass.

```js
var input = rgb2vol(data, width, height, mean);

var scores = model.forward(input);
var topInd = convnetjs.argmaxn(scores.w, n);
var topVal = convnetjs.maxn(scores.w, n);

// Log the class labels
for (var i = 0; i < n; i++) { 
  console.log(format(topVal[i]) + ' ' + labels[topInd[i]]); 
}
```

### Navigation through the Network

Unlike ConvNetJS, CaffeJS implements the network structure as a directed acyclic graph like Caffe. This means it can handle flexible graph traversal, parallel layers and layer dependencies out of the box. To iterate through the layers, please use the `CaffeModel.layerIterator()` method.

```js
model.layerIterator(function(layer, i, parents){
  // Do some funky stuff
});
```

To return a single layer of the network you can use the `CaffeModel.getLayer()` method.

```js
var layerName = 'inception_4c/output';

model.getLayer(layerName)
```

## Samples

### Analyze Deep Learning structures

The samples `00_*_model.html` load famous Deep Learning Models such as AlexNet, VGG, GoogLeNet, etc. directly in your browser. It also analyzes their structure and prints detailed information such as the network dimension, number of parameters and network size in memory to the Console.

> Please note that this samples don't load the networks' weights but only the structure with default initialization.

### Classification using GoogLeNet

This is a demo that uses the pretrained GoogLeNet from Caffe to perform classification entirely in your browser using images from your webcam.

### DeepDream

This is a cool demo that runs the famous [DeepDream](https://github.com/google/deepdream/blob/master/dream.ipynb) demo entirely in your browser. It uses the pretrained GoogLeNet from Caffe and runs the computation as webworker.

> Debugging this demo: Go to the `Sources` panel in the Chrome Developer Tools and load the demo. You should see a webworker icon entitled with `deepdream_worker.js`. You can click on it and set your breakpoints as usual. Additionally, you could enable `DevTools for Services Workers` in the `Resources` panel.

## What's left to do

* ConvNetJS - Implement more layers and missing parameters: some models need special layers, like elementwise sum, or convolution groups etc.
* CaffeJS - Find a good format for transferring the weights to the browser. The current TXT or JSON format is not suitable for large blobs. Maybe we can put the weights into an image (or images) and parse them with Canvas.
* CaffeJS - Layer structure, do we need blobs or are layers enough?
* CaffeJS - Nice documentation and more samples
* much more

## License

The software is provided under MIT license.