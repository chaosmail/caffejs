# CaffeJS - Development Guide

Please make sure you have Gulp, Typescript and Typings installed.

`npm install -g gulp-cli typescript typings`

## Getting Started

Checkout the project and run `npm install` in the root directory to get started. Now you can start diving into the code.

You can build your code running `gulp` or using the file watcher `gulp watch`.

### Organization of the code

This library uses Typescript to modularize JavaScript code and use some of the cool Typescript features on top, such as classes, inheritance, fat arrow functions, etc.

You can find the source code in the `modules/` directory where I organize in 5 modules:

* Net - A fork of ConvNetJS with Caffe compatibility (considering model weights, output parameters, etc.); contains the ConvNetJS model `Net.Net`, the CaffeJS model `Net.CaffeModel`, the the Volume implementation `Net.Vol` and the layers `Net.Layers`
* ImgJS - An image abstraction for JavaScript to avoid dealing with canvas elements and facilitate conversion to Volumes
* NumJS - An abstraction for operations on Arrays and Volumes
* Parser - A parser for converting Prototxt and Protobuf binaries into JavaScript objects
* Utils - An abstractions for utilities and visualizations, such as the GraphDrawer and ActivationDrawer

### Converting `*.caffemodel` files

You can use the script `scripts/convert_caffemodel.py` to convert `*.caffemodel` files to binary blobs which CaffeJS can load via http and parse. Unfortunately, you need to have `Caffe` and `pycaffe` installed to generate those files. You can as well download the prepared weights via running  `sh fetch_weights.sh` in the model directories.