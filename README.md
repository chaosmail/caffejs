# CaffeJS

This repo is a proof of concept for porting Caffe models to the browser using a modified version of [ConvNetJS (by Andrej Karpathy)](https://github.com/karpathy/convnetjs). It aims to help beginners to dive into Deep Neural Networks by using only a browser. Try out the ImageNet Classification using GoogleNet or the DeepDream entirely in your browser!

This work is pre-alpha and based on ConvNetJS (which is alpha), so you can imagine how much I need your help!

## What's possible with CaffeJS

* Playing around with Convolutional Neural Nets in the browser 
* Loading pretrained Deep Neural Nets entirely in JavaScript
* Running forward and backward passes through Deep Neural Nets
* Visualize model structure, activations and filters
* All of this without installing any software (also running on your mobile devices)

## How to run CaffeJS

Check out the project page hosted on [Github](https://chaosmail.github.io/caffejs/) which includes samples with a pretrained GoogLeNet. To run other Nets (like AlexNet, VGG or ResNet) one has to clone the repo on the local machine and download the additional model weights.

* [Getting Started](https://chaosmail.github.io/caffejs/)
* [User Guide](https://chaosmail.github.io/caffejs/user-guide.html)
* [Development Guide](https://chaosmail.github.io/caffejs/development-guide.html)
* Many cool examples and demos, like [ImageNet Classification](https://chaosmail.github.io/caffejs/webcam.html), [DeepDream](https://chaosmail.github.io/caffejs/deepdream.html), etc.

## What's left to do

* Debug and fix remaining issues with SoftMax layer
* Implement AVE pooling backward pass
* Implement more layers (Eltwise, Scale, BatchNorm) for ResNet
* Evaluate weight extraction directly from *.caffemodel file (without converting to intermediate binary format)
* Nice documentation
* More samples (Selfie Net, Gender- and AgeNet, Facial Expression Recognition, Segmentation, etc.)
* Write unit tests
* Implement FilterDrawer to visualize filters
* Auto-scale the filters and activations in the visualizations to a meaningful output dimension (seriously, 1x1 px filters are super small)

## License

The software is provided under MIT license.