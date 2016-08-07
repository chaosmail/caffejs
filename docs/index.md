# Deep Learning in the Browser

To run the samples, please execute `npm start` from the root directory. Make sure you updated all dependencies by running `npm install` beforehand.

### Analyze Deep Learning structures

[The sample `models.html`](https://chaosmail.github.io/caffejs/models.html) loads famous Deep Learning Models such as AlexNet, VGG, GoogLeNet, etc. directly in your browser and visualizes the layer graph. It also analyzes their structure and prints detailed information such as the network dimension, number of parameters and network size in memory to the console.

Here is a break-down of **AlexNet** computed with CaffeJS. The dimensions on the left side define the output dimensions of the current layer `d, h, w`. The memory size is computed using Float32 (4 byte).

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
...
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

### ImageNet Classification using GoogLeNet

[The demo `webcam.html`](https://chaosmail.github.io/caffejs/webcam.html) uses the pretrained GoogLeNet model from Caffe (trained on ImageNet) to perform classification entirely in your browser using images from your webcam.

### DeepDream

[The `deepdream.html`](https://chaosmail.github.io/caffejs/deepdream.html) is a cool example that runs the famous [DeepDream](https://github.com/google/deepdream/blob/master/dream.ipynb) demo entirely in your browser - entirely in JavaScript of course. It uses the pretrained GoogLeNet from Caffe and runs the computation as webworker.