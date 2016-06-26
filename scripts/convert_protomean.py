from __future__ import print_function
import fs
import numpy as np

# Make sure that caffe and pycaffe are installed
# and on the python path:
caffe_root = '../caffe/'  # this file is expected to be in {caffe_root}/examples
import sys
sys.path.insert(0, caffe_root + 'python')

import caffe

if len(sys.argv) != 3:
	print("Usage: python convert_protomean.py data/ilsvrc12/imagenet_mean.binaryproto data/ilsvrc12/imagenet_mean.txt")
	sys.exit()

blob = caffe.proto.caffe_pb2.BlobProto()
data = open( sys.argv[1] , 'rb' ).read()
blob.ParseFromString(data)
arr = np.array( caffe.io.blobproto_to_array(blob) )
s = np.shape(arr[0])
out = arr[0].reshape((3,s[1]*s[2])).tolist()

fs.write( sys.argv[2] , "\n".join(map(lambda o: ",".join(map(str, o)), out)) )