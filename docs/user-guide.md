# CaffeJS - User Guide

To run the samples, please execute `npm start` from the root directory. Make sure you updated all dependencies by running `npm install` beforehand.

## Running CaffeJS

Clone the repository to your local drive and then start a static webserver in the root directory (e.g. run `npm start`). Now you can open `models.html` that loads and visualizes popular deep learning architectures (such as AlexNet, VGG, GoogLeNet, etc.) to analyze their structure. This loads and parses the Caffe models from `.prototxt` files and convert them on-the-fly to ConvNetJS models.

To run a forward pass we need to load some pretrained model weights. First make sure you download the model weights for your particular model by running  `sh fetch_weights.sh` in the model directories. This will pull and unzip the binary model weights optimized for JavaScript form my Dropbox. These weights have been generated via the `scripts/convert_caffemodel.py`.

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