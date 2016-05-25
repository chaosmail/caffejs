# CaffeJS (not quite)

This repo is a proof of concept for porting Caffe models to the browser using ConvNetJS (by Andrej Karpathy). It aims to help beginners to dive into Deep Neural Networks by using only a browser.

This work is pre-alpha and based on ConvNetJS (which is alpha), so you can imagine how much I need your help!

## Running CaffeJS

Please note, that the ConvNetJS library in this repo is a [fork](https://github.com/chaosmail/convnetjs) of the original version.

Clone the repository to your local drive and then start a static webserver in the root directory (run `http-server`) for example. Now you can open the `00_*model.html` samples that load popular deep learning architectures (such as AlexNet, VGG, GoogLeNet, etc.) and analyze their structure. They actually load the Caffe models from `.prototxt` files and convert them on-the-fly to ConvNetJS models.

To run a forward pass we need to load some pretrained model weights. You can use the files `weights_to_json.py` and `weights_to_txt.py` to convert `*.caffemodel` files to JSON or TXT weights. Unfortunately, you need to have `Caffe` and `pycaffe` installed (which is a pain). However, I plan to host the ConvNetJS models on Dropbox as soon as I have found an acceptable format.

You can as well convert mean files using `python2 convert_protomean.py data/models/VGG_CNN_S/VGG_mean.binaryproto data/models/VGG_CNN_S/VGG_mean.txt` - however I will provide the mean TXT files in the repo.

## What's left to do

* ConvNetJS - Implement more layers and missing parameters: some models need special layers, like elementwise sum, or convolution groups etc.
* CaffeJS - Find a good format for transferring the weights to the browser. The current TXT or JSON format is not suitable for large blobs. Maybe we can put the weights into an image (or images) and parse them with Canvas.
* CaffeJS - Layer structure, do we need blobs or are layers enough?
* CaffeJS - Nice documentation and more samples
* much more

## License

The software is provided under MIT license.