import fs
import json
import numpy as np

# Make sure that caffe is on the python path:
caffe_root = '../caffe/'  # this file is expected to be in {caffe_root}/examples
import sys
sys.path.insert(0, caffe_root + 'python')

import caffe

model = "bvlc_alexnet"

# Set the right path to your model definition file, pretrained model weights,
# and the image you would like to classify.
MODEL_FILE = 'models/%s/deploy.prototxt' % model
PRETRAINED = 'models/%s/%s.caffemodel' % (model, model)
WEIGHTS_DIR = 'models/%s/weights/' % model

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

	print(nb_filter, stack_size, nb_col, nb_row)	
	print(np.array(blobs[0].data).shape)
	print(np.array(blobs[1].data).shape)

	weights_p = np.array(blobs[0].data).reshape((nb_filter, stack_size*nb_col*nb_row))
	weights_b = np.array(blobs[1].data)

	# weights_p = np.around(weights_p, decimals=3)
	# weights_b = np.around(weights_b, decimals=3)

	weights = {
		'filter': weights_p.astype(dtype=np.float32).tolist(),
		'bias': weights_b.astype(dtype=np.float32).tolist()
	}

	filename = WEIGHTS_DIR + key + '.json'

	if not fs.exists(fs.dirname(filename)):
		fs.mkdir(fs.dirname(filename))

	with open(filename, 'w') as outfile:
		json.dump(weights, outfile)