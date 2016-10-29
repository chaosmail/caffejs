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

## Datasets

Dealing with large datasets in JavaScript is a pain. We don't want to duplicate the images on our server, but we also don't want to maintain a long list of URLs in every application. Therefore I create a small Rest API `https://dataset.at/` in order to request URLs from images of certain datasets.

For evaluation, we often want random images from a dataset, such as ImageNet 2011. This is exactly what the API provides you.

### ImageNet

The REST service `https://dataset.at/imagenet/sample` returns an URL to a random image form ImageNet based on `http://image-net.org/download-imageurls` (Fall 2011 Release). It contains 1,824,000 URLs to image hosted on flickr.com over https (the other providers seem to be down). The API returns a JSON object similar to 

```json
{
  "error":false,
  "data":{
    "_id":"5813ae418988e03865cfa567",
    "id":"n02669295_21812",
    "url":"https://farm3.static.flickr.com/2414/2209258146_5b44b0290a.jpg"
  }
}
```

The field `id` represents the ImageNet image ID and it is formatted as xxxx_yyyy, where xxxx represents the WordNet ID (wnid) of this image. The WordNet ID corresponds with the class label.

Using the `fetch` API and `ImgJS` (a module from CaffeJS) you can load a new random image via following code.

```javascript
var apiUrl = 'https://dataset.at/imagenet/sample';
fetch(new Request(apiUrl)).then(function(response){
  response.json().then(function(d){
    var wnid = d.data.id.split('_')[0];
    var url = d.data.url);
    var image = new ImgJS.Image(url);
    image.load().then(function(){
      image.render();
    });
  });
});
```

Using `jQuery` you can load an image using the following snippet.

```javascript
var apiUrl = 'https://dataset.at/imagenet/sample';
$.getJSON(apiUrl, function(d) {
  $('<img src="'+ d.data.url +'">').load(function() {
    $(this).appendTo("body");
  });
});
```

Using `curl` you can download a new random image via the following one-liner.

```shell
curl -s -k https://dataset.at/imagenet/sample | jq -r '.data.url' | xargs curl -o image.jpg
```
 If you prefer the original filename, you can use `curl -O` instead.

### CIFAR10 (not yet supported)

The REST service `https://dataset.at/cifar10/sample` returns an URL to a random image from the CIFAR10 dataset based on `https://www.cs.toronto.edu/~kriz/cifar.html`.

### MNIST (not yet supported)

The REST service `https://dataset.at/mnist/sample` returns an URL to a random image from the mnist dataset based on `http://cs.nyu.edu/~roweis/data/mnist_train{0-9}.jpg` and `http://cs.nyu.edu/~roweis/data/mnist_test{0-9}.jpg`.