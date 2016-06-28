from __future__ import print_function
import fs
import json
import numpy as np

# Make sure that caffe and pycaffe are installed
# and on the python path:
caffe_root = '../../caffe/'  # this file is expected to be in {caffe_root}/examples
import sys
sys.path.insert(0, caffe_root + 'python')

import caffe

model = "bvlc_googlenet"

# Set the right path to your model definition file, pretrained model weights,
# and the image you would like to classify.
MODEL_FILE = '../examples/models/%s/deploy.prototxt' % model
PRETRAINED = '../examples/models/%s/%s.caffemodel' % (model, model)
WEIGHTS_DIR = '../examples/models/%s/weights/' % model

# Can be either 0 for TRAIN or 1 for TEST
phase = 1

net = caffe.Net(MODEL_FILE, PRETRAINED, phase)

def rot90(W):
    for i in range(W.shape[0]):
        for j in range(W.shape[1]):
            W[i, j] = np.rot90(W[i, j], 2)
    return W

for key in net.params:
	blobs = net.params[key]
	nb_filter = blobs[0].num
	stack_size = blobs[0].channels
	nb_col = blobs[0].height
	nb_row = blobs[0].width

	print("====> Layer: ", key)
	print("Expected Shape: ", nb_filter, stack_size, nb_col, nb_row)	
	print("Found Shape: ", np.array(blobs[0].data).shape)

	weights_p = blobs[0].data.astype(dtype=np.float32)
	weights_b = blobs[1].data.astype(dtype=np.float32)

	if len(weights_p.shape) > 2:
		# Caffe uses the shape f, (d, y, x)
		# ConvnetJS uses the shape f, (y, x, d)
		weights_p = np.swapaxes(np.swapaxes(weights_p, 3, 1), 2, 1)

	print("Converted to Shape: ", weights_p.shape)

	weights = {
		'filter': weights_p.reshape((nb_filter, stack_size*nb_col*nb_row)).tolist(),
		'bias': weights_b.tolist()
	}

	filename = WEIGHTS_DIR + key + '.txt'

	if not fs.exists(fs.dirname(filename)):
		fs.mkdir(fs.dirname(filename))

	fs.write(fs.add_suffix(filename, "_filter"), "")
	for i, f_weights in enumerate(weights['filter']):
		if i == len(weights['filter']) - 1:
			fs.append(fs.add_suffix(filename, "_filter"), ",".join(map(str, f_weights)))
		else:
			fs.append(fs.add_suffix(filename, "_filter"), ",".join(map(str, f_weights)) + "\n")

	fs.write(fs.add_suffix(filename, "_bias"), ",".join(map(str, weights['bias'])))