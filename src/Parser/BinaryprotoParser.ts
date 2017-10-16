/// <reference path="./BinaryParser.ts" />

namespace Parser {

  // declare Protobuf decoder
  declare var dcodeIO: any;

  export abstract class BinaryprotoParser extends BinaryParser {

    parseBuffer(raw: ArrayBuffer){
      

      var _ = dcodeIO.ProtoBuf.newBuilder({})['import']({
        "package": "caffe",
        "messages": [
          {
            "name": "BlobShape",
            "fields": [
              {
                "rule": "repeated",
                "type": "int64",
                "name": "dim",
                "id": 1,
                "options": {
                  "packed": true
                }
              }
            ]
          },
          {
            "name": "BlobProto",
            "fields": [
              {
                "rule": "optional",
                "type": "BlobShape",
                "name": "shape",
                "id": 7
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "data",
                "id": 5,
                "options": {
                  "packed": true
                }
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "diff",
                "id": 6,
                "options": {
                  "packed": true
                }
              },
              {
                "rule": "repeated",
                "type": "double",
                "name": "double_data",
                "id": 8,
                "options": {
                  "packed": true
                }
              },
              {
                "rule": "repeated",
                "type": "double",
                "name": "double_diff",
                "id": 9,
                "options": {
                  "packed": true
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "num",
                "id": 1,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "channels",
                "id": 2,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "height",
                "id": 3,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "width",
                "id": 4,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "BlobProtoVector",
            "fields": [
              {
                "rule": "repeated",
                "type": "BlobProto",
                "name": "blobs",
                "id": 1
              }
            ]
          },
          {
            "name": "Datum",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "channels",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "height",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "width",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "bytes",
                "name": "data",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "label",
                "id": 5
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "float_data",
                "id": 6
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "encoded",
                "id": 7,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "FillerParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 1,
                "options": {
                  "default": "constant"
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "value",
                "id": 2,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "min",
                "id": 3,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "max",
                "id": 4,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "mean",
                "id": 5,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "std",
                "id": 6,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "sparse",
                "id": 7,
                "options": {
                  "default": -1
                }
              },
              {
                "rule": "optional",
                "type": "VarianceNorm",
                "name": "variance_norm",
                "id": 8,
                "options": {
                  "default": "FAN_IN"
                }
              }
            ],
            "enums": [
              {
                "name": "VarianceNorm",
                "values": [
                  {
                    "name": "FAN_IN",
                    "id": 0
                  },
                  {
                    "name": "FAN_OUT",
                    "id": 1
                  },
                  {
                    "name": "AVERAGE",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "NetParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "input",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "BlobShape",
                "name": "input_shape",
                "id": 8
              },
              {
                "rule": "repeated",
                "type": "int32",
                "name": "input_dim",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "force_backward",
                "id": 5,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "NetState",
                "name": "state",
                "id": 6
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "debug_info",
                "id": 7,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "repeated",
                "type": "LayerParameter",
                "name": "layer",
                "id": 100
              },
              {
                "rule": "repeated",
                "type": "V1LayerParameter",
                "name": "layers",
                "id": 2
              }
            ]
          },
          {
            "name": "SolverParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "net",
                "id": 24
              },
              {
                "rule": "optional",
                "type": "NetParameter",
                "name": "net_param",
                "id": 25
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "train_net",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "test_net",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "NetParameter",
                "name": "train_net_param",
                "id": 21
              },
              {
                "rule": "repeated",
                "type": "NetParameter",
                "name": "test_net_param",
                "id": 22
              },
              {
                "rule": "optional",
                "type": "NetState",
                "name": "train_state",
                "id": 26
              },
              {
                "rule": "repeated",
                "type": "NetState",
                "name": "test_state",
                "id": 27
              },
              {
                "rule": "repeated",
                "type": "int32",
                "name": "test_iter",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "test_interval",
                "id": 4,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "test_compute_loss",
                "id": 19,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "test_initialization",
                "id": 32,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "base_lr",
                "id": 5
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "display",
                "id": 6
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "average_loss",
                "id": 33,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "max_iter",
                "id": 7
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "iter_size",
                "id": 36,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "lr_policy",
                "id": 8
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "gamma",
                "id": 9
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "power",
                "id": 10
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "momentum",
                "id": 11
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "weight_decay",
                "id": 12
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "regularization_type",
                "id": 29,
                "options": {
                  "default": "L2"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "stepsize",
                "id": 13
              },
              {
                "rule": "repeated",
                "type": "int32",
                "name": "stepvalue",
                "id": 34
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "clip_gradients",
                "id": 35,
                "options": {
                  "default": -1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "snapshot",
                "id": 14,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "snapshot_prefix",
                "id": 15
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "snapshot_diff",
                "id": 16,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "SnapshotFormat",
                "name": "snapshot_format",
                "id": 37,
                "options": {
                  "default": "BINARYPROTO"
                }
              },
              {
                "rule": "optional",
                "type": "SolverMode",
                "name": "solver_mode",
                "id": 17,
                "options": {
                  "default": "GPU"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "device_id",
                "id": 18,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int64",
                "name": "random_seed",
                "id": 20,
                "options": {
                  "default": -1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 40,
                "options": {
                  "default": "SGD"
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "delta",
                "id": 31,
                "options": {
                  "default": 1e-8
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "momentum2",
                "id": 39,
                "options": {
                  "default": 0.999
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "rms_decay",
                "id": 38
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "debug_info",
                "id": 23,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "snapshot_after_train",
                "id": 28,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "SolverType",
                "name": "solver_type",
                "id": 30,
                "options": {
                  "default": "SGD"
                }
              }
            ],
            "enums": [
              {
                "name": "SnapshotFormat",
                "values": [
                  {
                    "name": "HDF5",
                    "id": 0
                  },
                  {
                    "name": "BINARYPROTO",
                    "id": 1
                  }
                ]
              },
              {
                "name": "SolverMode",
                "values": [
                  {
                    "name": "CPU",
                    "id": 0
                  },
                  {
                    "name": "GPU",
                    "id": 1
                  }
                ]
              },
              {
                "name": "SolverType",
                "values": [
                  {
                    "name": "SGD",
                    "id": 0
                  },
                  {
                    "name": "NESTEROV",
                    "id": 1
                  },
                  {
                    "name": "ADAGRAD",
                    "id": 2
                  },
                  {
                    "name": "RMSPROP",
                    "id": 3
                  },
                  {
                    "name": "ADADELTA",
                    "id": 4
                  },
                  {
                    "name": "ADAM",
                    "id": 5
                  }
                ]
              }
            ]
          },
          {
            "name": "SolverState",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "iter",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "learned_net",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "BlobProto",
                "name": "history",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "current_step",
                "id": 4,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "NetState",
            "fields": [
              {
                "rule": "optional",
                "type": "Phase",
                "name": "phase",
                "id": 1,
                "options": {
                  "default": "TEST"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "level",
                "id": 2,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "stage",
                "id": 3
              }
            ]
          },
          {
            "name": "NetStateRule",
            "fields": [
              {
                "rule": "optional",
                "type": "Phase",
                "name": "phase",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "min_level",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "max_level",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "stage",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "not_stage",
                "id": 5
              }
            ]
          },
          {
            "name": "ParamSpec",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "DimCheckMode",
                "name": "share_mode",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "lr_mult",
                "id": 3,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "decay_mult",
                "id": 4,
                "options": {
                  "default": 1
                }
              }
            ],
            "enums": [
              {
                "name": "DimCheckMode",
                "values": [
                  {
                    "name": "STRICT",
                    "id": 0
                  },
                  {
                    "name": "PERMISSIVE",
                    "id": 1
                  }
                ]
              }
            ]
          },
          {
            "name": "LayerParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "bottom",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "top",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "Phase",
                "name": "phase",
                "id": 10
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "loss_weight",
                "id": 5
              },
              {
                "rule": "repeated",
                "type": "ParamSpec",
                "name": "param",
                "id": 6
              },
              {
                "rule": "repeated",
                "type": "BlobProto",
                "name": "blobs",
                "id": 7
              },
              {
                "rule": "repeated",
                "type": "bool",
                "name": "propagate_down",
                "id": 11
              },
              {
                "rule": "repeated",
                "type": "NetStateRule",
                "name": "include",
                "id": 8
              },
              {
                "rule": "repeated",
                "type": "NetStateRule",
                "name": "exclude",
                "id": 9
              },
              {
                "rule": "optional",
                "type": "TransformationParameter",
                "name": "transform_param",
                "id": 100
              },
              {
                "rule": "optional",
                "type": "LossParameter",
                "name": "loss_param",
                "id": 101
              },
              {
                "rule": "optional",
                "type": "AccuracyParameter",
                "name": "accuracy_param",
                "id": 102
              },
              {
                "rule": "optional",
                "type": "ArgMaxParameter",
                "name": "argmax_param",
                "id": 103
              },
              {
                "rule": "optional",
                "type": "BatchNormParameter",
                "name": "batch_norm_param",
                "id": 139
              },
              {
                "rule": "optional",
                "type": "BiasParameter",
                "name": "bias_param",
                "id": 141
              },
              {
                "rule": "optional",
                "type": "ConcatParameter",
                "name": "concat_param",
                "id": 104
              },
              {
                "rule": "optional",
                "type": "ContrastiveLossParameter",
                "name": "contrastive_loss_param",
                "id": 105
              },
              {
                "rule": "optional",
                "type": "ConvolutionParameter",
                "name": "convolution_param",
                "id": 106
              },
              {
                "rule": "optional",
                "type": "CropParameter",
                "name": "crop_param",
                "id": 144
              },
              {
                "rule": "optional",
                "type": "DataParameter",
                "name": "data_param",
                "id": 107
              },
              {
                "rule": "optional",
                "type": "DropoutParameter",
                "name": "dropout_param",
                "id": 108
              },
              {
                "rule": "optional",
                "type": "DummyDataParameter",
                "name": "dummy_data_param",
                "id": 109
              },
              {
                "rule": "optional",
                "type": "EltwiseParameter",
                "name": "eltwise_param",
                "id": 110
              },
              {
                "rule": "optional",
                "type": "ELUParameter",
                "name": "elu_param",
                "id": 140
              },
              {
                "rule": "optional",
                "type": "EmbedParameter",
                "name": "embed_param",
                "id": 137
              },
              {
                "rule": "optional",
                "type": "ExpParameter",
                "name": "exp_param",
                "id": 111
              },
              {
                "rule": "optional",
                "type": "FlattenParameter",
                "name": "flatten_param",
                "id": 135
              },
              {
                "rule": "optional",
                "type": "HDF5DataParameter",
                "name": "hdf5_data_param",
                "id": 112
              },
              {
                "rule": "optional",
                "type": "HDF5OutputParameter",
                "name": "hdf5_output_param",
                "id": 113
              },
              {
                "rule": "optional",
                "type": "HingeLossParameter",
                "name": "hinge_loss_param",
                "id": 114
              },
              {
                "rule": "optional",
                "type": "ImageDataParameter",
                "name": "image_data_param",
                "id": 115
              },
              {
                "rule": "optional",
                "type": "InfogainLossParameter",
                "name": "infogain_loss_param",
                "id": 116
              },
              {
                "rule": "optional",
                "type": "InnerProductParameter",
                "name": "inner_product_param",
                "id": 117
              },
              {
                "rule": "optional",
                "type": "InputParameter",
                "name": "input_param",
                "id": 143
              },
              {
                "rule": "optional",
                "type": "LogParameter",
                "name": "log_param",
                "id": 134
              },
              {
                "rule": "optional",
                "type": "LRNParameter",
                "name": "lrn_param",
                "id": 118
              },
              {
                "rule": "optional",
                "type": "MemoryDataParameter",
                "name": "memory_data_param",
                "id": 119
              },
              {
                "rule": "optional",
                "type": "MVNParameter",
                "name": "mvn_param",
                "id": 120
              },
              {
                "rule": "optional",
                "type": "ParameterParameter",
                "name": "parameter_param",
                "id": 145
              },
              {
                "rule": "optional",
                "type": "PoolingParameter",
                "name": "pooling_param",
                "id": 121
              },
              {
                "rule": "optional",
                "type": "PowerParameter",
                "name": "power_param",
                "id": 122
              },
              {
                "rule": "optional",
                "type": "PReLUParameter",
                "name": "prelu_param",
                "id": 131
              },
              {
                "rule": "optional",
                "type": "PythonParameter",
                "name": "python_param",
                "id": 130
              },
              {
                "rule": "optional",
                "type": "ReductionParameter",
                "name": "reduction_param",
                "id": 136
              },
              {
                "rule": "optional",
                "type": "ReLUParameter",
                "name": "relu_param",
                "id": 123
              },
              {
                "rule": "optional",
                "type": "ReshapeParameter",
                "name": "reshape_param",
                "id": 133
              },
              {
                "rule": "optional",
                "type": "ScaleParameter",
                "name": "scale_param",
                "id": 142
              },
              {
                "rule": "optional",
                "type": "SigmoidParameter",
                "name": "sigmoid_param",
                "id": 124
              },
              {
                "rule": "optional",
                "type": "SoftmaxParameter",
                "name": "softmax_param",
                "id": 125
              },
              {
                "rule": "optional",
                "type": "SPPParameter",
                "name": "spp_param",
                "id": 132
              },
              {
                "rule": "optional",
                "type": "SliceParameter",
                "name": "slice_param",
                "id": 126
              },
              {
                "rule": "optional",
                "type": "TanHParameter",
                "name": "tanh_param",
                "id": 127
              },
              {
                "rule": "optional",
                "type": "ThresholdParameter",
                "name": "threshold_param",
                "id": 128
              },
              {
                "rule": "optional",
                "type": "TileParameter",
                "name": "tile_param",
                "id": 138
              },
              {
                "rule": "optional",
                "type": "WindowDataParameter",
                "name": "window_data_param",
                "id": 129
              }
            ]
          },
          {
            "name": "TransformationParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "mirror",
                "id": 2,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "crop_size",
                "id": 3,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "mean_file",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "mean_value",
                "id": 5
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "force_color",
                "id": 6,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "force_gray",
                "id": 7,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "LossParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "ignore_label",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "NormalizationMode",
                "name": "normalization",
                "id": 3,
                "options": {
                  "default": "VALID"
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "normalize",
                "id": 2
              }
            ],
            "enums": [
              {
                "name": "NormalizationMode",
                "values": [
                  {
                    "name": "FULL",
                    "id": 0
                  },
                  {
                    "name": "VALID",
                    "id": 1
                  },
                  {
                    "name": "BATCH_SIZE",
                    "id": 2
                  },
                  {
                    "name": "NONE",
                    "id": 3
                  }
                ]
              }
            ]
          },
          {
            "name": "AccuracyParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "top_k",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "ignore_label",
                "id": 3
              }
            ]
          },
          {
            "name": "ArgMaxParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "bool",
                "name": "out_max_val",
                "id": 1,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "top_k",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 3
              }
            ]
          },
          {
            "name": "ConcatParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "concat_dim",
                "id": 1,
                "options": {
                  "default": 1
                }
              }
            ]
          },
          {
            "name": "BatchNormParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "bool",
                "name": "use_global_stats",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "moving_average_fraction",
                "id": 2,
                "options": {
                  "default": 0.999
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "eps",
                "id": 3,
                "options": {
                  "default": 0.00001
                }
              }
            ]
          },
          {
            "name": "BiasParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "num_axes",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "filler",
                "id": 3
              }
            ]
          },
          {
            "name": "ContrastiveLossParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "margin",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "legacy_version",
                "id": 2,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "ConvolutionParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "num_output",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "bias_term",
                "id": 2,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "pad",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "kernel_size",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "stride",
                "id": 6
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "dilation",
                "id": 18
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad_h",
                "id": 9,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad_w",
                "id": 10,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernel_h",
                "id": 11
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernel_w",
                "id": 12
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride_h",
                "id": 13
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride_w",
                "id": 14
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "group",
                "id": 5,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "weight_filler",
                "id": 7
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "bias_filler",
                "id": 8
              },
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 15,
                "options": {
                  "default": "DEFAULT"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 16,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "force_nd_im2col",
                "id": 17,
                "options": {
                  "default": false
                }
              }
            ],
            "enums": [
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "CropParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 1,
                "options": {
                  "default": 2
                }
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "offset",
                "id": 2
              }
            ]
          },
          {
            "name": "DataParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batch_size",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "rand_skip",
                "id": 7,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "DB",
                "name": "backend",
                "id": 8,
                "options": {
                  "default": "LEVELDB"
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "mean_file",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "crop_size",
                "id": 5,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "mirror",
                "id": 6,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "force_encoded_color",
                "id": 9,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "prefetch",
                "id": 10,
                "options": {
                  "default": 4
                }
              }
            ],
            "enums": [
              {
                "name": "DB",
                "values": [
                  {
                    "name": "LEVELDB",
                    "id": 0
                  },
                  {
                    "name": "LMDB",
                    "id": 1
                  }
                ]
              }
            ]
          },
          {
            "name": "DropoutParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "dropout_ratio",
                "id": 1,
                "options": {
                  "default": 0.5
                }
              }
            ]
          },
          {
            "name": "DummyDataParameter",
            "fields": [
              {
                "rule": "repeated",
                "type": "FillerParameter",
                "name": "data_filler",
                "id": 1
              },
              {
                "rule": "repeated",
                "type": "BlobShape",
                "name": "shape",
                "id": 6
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "num",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "channels",
                "id": 3
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "height",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "width",
                "id": 5
              }
            ]
          },
          {
            "name": "EltwiseParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "EltwiseOp",
                "name": "operation",
                "id": 1,
                "options": {
                  "default": "SUM"
                }
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "coeff",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "stable_prod_grad",
                "id": 3,
                "options": {
                  "default": true
                }
              }
            ],
            "enums": [
              {
                "name": "EltwiseOp",
                "values": [
                  {
                    "name": "PROD",
                    "id": 0
                  },
                  {
                    "name": "SUM",
                    "id": 1
                  },
                  {
                    "name": "MAX",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "ELUParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "alpha",
                "id": 1,
                "options": {
                  "default": 1
                }
              }
            ]
          },
          {
            "name": "EmbedParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "num_output",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "input_dim",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "bias_term",
                "id": 3,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "weight_filler",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "bias_filler",
                "id": 5
              }
            ]
          },
          {
            "name": "ExpParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "base",
                "id": 1,
                "options": {
                  "default": -1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "shift",
                "id": 3,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "FlattenParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "end_axis",
                "id": 2,
                "options": {
                  "default": -1
                }
              }
            ]
          },
          {
            "name": "HDF5DataParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batch_size",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "shuffle",
                "id": 3,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "HDF5OutputParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "file_name",
                "id": 1
              }
            ]
          },
          {
            "name": "HingeLossParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "Norm",
                "name": "norm",
                "id": 1,
                "options": {
                  "default": "L1"
                }
              }
            ],
            "enums": [
              {
                "name": "Norm",
                "values": [
                  {
                    "name": "L1",
                    "id": 1
                  },
                  {
                    "name": "L2",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "ImageDataParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batch_size",
                "id": 4,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "rand_skip",
                "id": 7,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "shuffle",
                "id": 8,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "new_height",
                "id": 9,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "new_width",
                "id": 10,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "is_color",
                "id": 11,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "mean_file",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "crop_size",
                "id": 5,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "mirror",
                "id": 6,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "root_folder",
                "id": 12,
                "options": {
                  "default": ""
                }
              }
            ]
          },
          {
            "name": "InfogainLossParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 1
              }
            ]
          },
          {
            "name": "InnerProductParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "num_output",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "bias_term",
                "id": 2,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "weight_filler",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "bias_filler",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 5,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "transpose",
                "id": 6,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "InputParameter",
            "fields": [
              {
                "rule": "repeated",
                "type": "BlobShape",
                "name": "shape",
                "id": 1
              }
            ]
          },
          {
            "name": "LogParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "base",
                "id": 1,
                "options": {
                  "default": -1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "shift",
                "id": 3,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "LRNParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "local_size",
                "id": 1,
                "options": {
                  "default": 5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "alpha",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "beta",
                "id": 3,
                "options": {
                  "default": 0.75
                }
              },
              {
                "rule": "optional",
                "type": "NormRegion",
                "name": "norm_region",
                "id": 4,
                "options": {
                  "default": "ACROSS_CHANNELS"
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "k",
                "id": 5,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 6,
                "options": {
                  "default": "DEFAULT"
                }
              }
            ],
            "enums": [
              {
                "name": "NormRegion",
                "values": [
                  {
                    "name": "ACROSS_CHANNELS",
                    "id": 0
                  },
                  {
                    "name": "WITHIN_CHANNEL",
                    "id": 1
                  }
                ]
              },
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "MemoryDataParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batch_size",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "channels",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "height",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "width",
                "id": 4
              }
            ]
          },
          {
            "name": "MVNParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "bool",
                "name": "normalize_variance",
                "id": 1,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "across_channels",
                "id": 2,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "eps",
                "id": 3,
                "options": {
                  "default": 1e-9
                }
              }
            ]
          },
          {
            "name": "ParameterParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "BlobShape",
                "name": "shape",
                "id": 1
              }
            ]
          },
          {
            "name": "PoolingParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "PoolMethod",
                "name": "pool",
                "id": 1,
                "options": {
                  "default": "MAX"
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad",
                "id": 4,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad_h",
                "id": 9,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad_w",
                "id": 10,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernel_size",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernel_h",
                "id": 5
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernel_w",
                "id": 6
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride",
                "id": 3,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride_h",
                "id": 7
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride_w",
                "id": 8
              },
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 11,
                "options": {
                  "default": "DEFAULT"
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "global_pooling",
                "id": 12,
                "options": {
                  "default": false
                }
              }
            ],
            "enums": [
              {
                "name": "PoolMethod",
                "values": [
                  {
                    "name": "MAX",
                    "id": 0
                  },
                  {
                    "name": "AVE",
                    "id": 1
                  },
                  {
                    "name": "STOCHASTIC",
                    "id": 2
                  }
                ]
              },
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "PowerParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "power",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "shift",
                "id": 3,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "PythonParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "module",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "layer",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "param_str",
                "id": 3,
                "options": {
                  "default": ""
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "share_in_parallel",
                "id": 4,
                "options": {
                  "default": false
                }
              }
            ]
          },
          {
            "name": "ReductionParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "ReductionOp",
                "name": "operation",
                "id": 1,
                "options": {
                  "default": "SUM"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 2,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "coeff",
                "id": 3,
                "options": {
                  "default": 1
                }
              }
            ],
            "enums": [
              {
                "name": "ReductionOp",
                "values": [
                  {
                    "name": "SUM",
                    "id": 1
                  },
                  {
                    "name": "ASUM",
                    "id": 2
                  },
                  {
                    "name": "SUMSQ",
                    "id": 3
                  },
                  {
                    "name": "MEAN",
                    "id": 4
                  }
                ]
              }
            ]
          },
          {
            "name": "ReLUParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "negative_slope",
                "id": 1,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 2,
                "options": {
                  "default": "DEFAULT"
                }
              }
            ],
            "enums": [
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "ReshapeParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "BlobShape",
                "name": "shape",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 2,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "num_axes",
                "id": 3,
                "options": {
                  "default": -1
                }
              }
            ]
          },
          {
            "name": "ScaleParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "num_axes",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "filler",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "bias_term",
                "id": 4,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "bias_filler",
                "id": 5
              }
            ]
          },
          {
            "name": "SigmoidParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 1,
                "options": {
                  "default": "DEFAULT"
                }
              }
            ],
            "enums": [
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "SliceParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 3,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "repeated",
                "type": "uint32",
                "name": "slice_point",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "slice_dim",
                "id": 1,
                "options": {
                  "default": 1
                }
              }
            ]
          },
          {
            "name": "SoftmaxParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 1,
                "options": {
                  "default": "DEFAULT"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 2,
                "options": {
                  "default": 1
                }
              }
            ],
            "enums": [
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "TanHParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 1,
                "options": {
                  "default": "DEFAULT"
                }
              }
            ],
            "enums": [
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "TileParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "int32",
                "name": "axis",
                "id": 1,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "tiles",
                "id": 2
              }
            ]
          },
          {
            "name": "ThresholdParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "float",
                "name": "threshold",
                "id": 1,
                "options": {
                  "default": 0
                }
              }
            ]
          },
          {
            "name": "WindowDataParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 2,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "mean_file",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batch_size",
                "id": 4
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "crop_size",
                "id": 5,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "mirror",
                "id": 6,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "fg_threshold",
                "id": 7,
                "options": {
                  "default": 0.5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "bg_threshold",
                "id": 8,
                "options": {
                  "default": 0.5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "fg_fraction",
                "id": 9,
                "options": {
                  "default": 0.25
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "context_pad",
                "id": 10,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "crop_mode",
                "id": 11,
                "options": {
                  "default": "warp"
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "cache_images",
                "id": 12,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "root_folder",
                "id": 13,
                "options": {
                  "default": ""
                }
              }
            ]
          },
          {
            "name": "SPPParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pyramid_height",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "PoolMethod",
                "name": "pool",
                "id": 2,
                "options": {
                  "default": "MAX"
                }
              },
              {
                "rule": "optional",
                "type": "Engine",
                "name": "engine",
                "id": 6,
                "options": {
                  "default": "DEFAULT"
                }
              }
            ],
            "enums": [
              {
                "name": "PoolMethod",
                "values": [
                  {
                    "name": "MAX",
                    "id": 0
                  },
                  {
                    "name": "AVE",
                    "id": 1
                  },
                  {
                    "name": "STOCHASTIC",
                    "id": 2
                  }
                ]
              },
              {
                "name": "Engine",
                "values": [
                  {
                    "name": "DEFAULT",
                    "id": 0
                  },
                  {
                    "name": "CAFFE",
                    "id": 1
                  },
                  {
                    "name": "CUDNN",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "V1LayerParameter",
            "fields": [
              {
                "rule": "repeated",
                "type": "string",
                "name": "bottom",
                "id": 2
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "top",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "name",
                "id": 4
              },
              {
                "rule": "repeated",
                "type": "NetStateRule",
                "name": "include",
                "id": 32
              },
              {
                "rule": "repeated",
                "type": "NetStateRule",
                "name": "exclude",
                "id": 33
              },
              {
                "rule": "optional",
                "type": "LayerType",
                "name": "type",
                "id": 5
              },
              {
                "rule": "repeated",
                "type": "BlobProto",
                "name": "blobs",
                "id": 6
              },
              {
                "rule": "repeated",
                "type": "string",
                "name": "param",
                "id": 1001
              },
              {
                "rule": "repeated",
                "type": "DimCheckMode",
                "name": "blob_share_mode",
                "id": 1002
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "blobs_lr",
                "id": 7
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "weight_decay",
                "id": 8
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "loss_weight",
                "id": 35
              },
              {
                "rule": "optional",
                "type": "AccuracyParameter",
                "name": "accuracy_param",
                "id": 27
              },
              {
                "rule": "optional",
                "type": "ArgMaxParameter",
                "name": "argmax_param",
                "id": 23
              },
              {
                "rule": "optional",
                "type": "ConcatParameter",
                "name": "concat_param",
                "id": 9
              },
              {
                "rule": "optional",
                "type": "ContrastiveLossParameter",
                "name": "contrastive_loss_param",
                "id": 40
              },
              {
                "rule": "optional",
                "type": "ConvolutionParameter",
                "name": "convolution_param",
                "id": 10
              },
              {
                "rule": "optional",
                "type": "DataParameter",
                "name": "data_param",
                "id": 11
              },
              {
                "rule": "optional",
                "type": "DropoutParameter",
                "name": "dropout_param",
                "id": 12
              },
              {
                "rule": "optional",
                "type": "DummyDataParameter",
                "name": "dummy_data_param",
                "id": 26
              },
              {
                "rule": "optional",
                "type": "EltwiseParameter",
                "name": "eltwise_param",
                "id": 24
              },
              {
                "rule": "optional",
                "type": "ExpParameter",
                "name": "exp_param",
                "id": 41
              },
              {
                "rule": "optional",
                "type": "HDF5DataParameter",
                "name": "hdf5_data_param",
                "id": 13
              },
              {
                "rule": "optional",
                "type": "HDF5OutputParameter",
                "name": "hdf5_output_param",
                "id": 14
              },
              {
                "rule": "optional",
                "type": "HingeLossParameter",
                "name": "hinge_loss_param",
                "id": 29
              },
              {
                "rule": "optional",
                "type": "ImageDataParameter",
                "name": "image_data_param",
                "id": 15
              },
              {
                "rule": "optional",
                "type": "InfogainLossParameter",
                "name": "infogain_loss_param",
                "id": 16
              },
              {
                "rule": "optional",
                "type": "InnerProductParameter",
                "name": "inner_product_param",
                "id": 17
              },
              {
                "rule": "optional",
                "type": "LRNParameter",
                "name": "lrn_param",
                "id": 18
              },
              {
                "rule": "optional",
                "type": "MemoryDataParameter",
                "name": "memory_data_param",
                "id": 22
              },
              {
                "rule": "optional",
                "type": "MVNParameter",
                "name": "mvn_param",
                "id": 34
              },
              {
                "rule": "optional",
                "type": "PoolingParameter",
                "name": "pooling_param",
                "id": 19
              },
              {
                "rule": "optional",
                "type": "PowerParameter",
                "name": "power_param",
                "id": 21
              },
              {
                "rule": "optional",
                "type": "ReLUParameter",
                "name": "relu_param",
                "id": 30
              },
              {
                "rule": "optional",
                "type": "SigmoidParameter",
                "name": "sigmoid_param",
                "id": 38
              },
              {
                "rule": "optional",
                "type": "SoftmaxParameter",
                "name": "softmax_param",
                "id": 39
              },
              {
                "rule": "optional",
                "type": "SliceParameter",
                "name": "slice_param",
                "id": 31
              },
              {
                "rule": "optional",
                "type": "TanHParameter",
                "name": "tanh_param",
                "id": 37
              },
              {
                "rule": "optional",
                "type": "ThresholdParameter",
                "name": "threshold_param",
                "id": 25
              },
              {
                "rule": "optional",
                "type": "WindowDataParameter",
                "name": "window_data_param",
                "id": 20
              },
              {
                "rule": "optional",
                "type": "TransformationParameter",
                "name": "transform_param",
                "id": 36
              },
              {
                "rule": "optional",
                "type": "LossParameter",
                "name": "loss_param",
                "id": 42
              },
              {
                "rule": "optional",
                "type": "V0LayerParameter",
                "name": "layer",
                "id": 1
              }
            ],
            "enums": [
              {
                "name": "LayerType",
                "values": [
                  {
                    "name": "NONE",
                    "id": 0
                  },
                  {
                    "name": "ABSVAL",
                    "id": 35
                  },
                  {
                    "name": "ACCURACY",
                    "id": 1
                  },
                  {
                    "name": "ARGMAX",
                    "id": 30
                  },
                  {
                    "name": "BNLL",
                    "id": 2
                  },
                  {
                    "name": "CONCAT",
                    "id": 3
                  },
                  {
                    "name": "CONTRASTIVE_LOSS",
                    "id": 37
                  },
                  {
                    "name": "CONVOLUTION",
                    "id": 4
                  },
                  {
                    "name": "DATA",
                    "id": 5
                  },
                  {
                    "name": "DECONVOLUTION",
                    "id": 39
                  },
                  {
                    "name": "DROPOUT",
                    "id": 6
                  },
                  {
                    "name": "DUMMY_DATA",
                    "id": 32
                  },
                  {
                    "name": "EUCLIDEAN_LOSS",
                    "id": 7
                  },
                  {
                    "name": "ELTWISE",
                    "id": 25
                  },
                  {
                    "name": "EXP",
                    "id": 38
                  },
                  {
                    "name": "FLATTEN",
                    "id": 8
                  },
                  {
                    "name": "HDF5_DATA",
                    "id": 9
                  },
                  {
                    "name": "HDF5_OUTPUT",
                    "id": 10
                  },
                  {
                    "name": "HINGE_LOSS",
                    "id": 28
                  },
                  {
                    "name": "IM2COL",
                    "id": 11
                  },
                  {
                    "name": "IMAGE_DATA",
                    "id": 12
                  },
                  {
                    "name": "INFOGAIN_LOSS",
                    "id": 13
                  },
                  {
                    "name": "INNER_PRODUCT",
                    "id": 14
                  },
                  {
                    "name": "LRN",
                    "id": 15
                  },
                  {
                    "name": "MEMORY_DATA",
                    "id": 29
                  },
                  {
                    "name": "MULTINOMIAL_LOGISTIC_LOSS",
                    "id": 16
                  },
                  {
                    "name": "MVN",
                    "id": 34
                  },
                  {
                    "name": "POOLING",
                    "id": 17
                  },
                  {
                    "name": "POWER",
                    "id": 26
                  },
                  {
                    "name": "RELU",
                    "id": 18
                  },
                  {
                    "name": "SIGMOID",
                    "id": 19
                  },
                  {
                    "name": "SIGMOID_CROSS_ENTROPY_LOSS",
                    "id": 27
                  },
                  {
                    "name": "SILENCE",
                    "id": 36
                  },
                  {
                    "name": "SOFTMAX",
                    "id": 20
                  },
                  {
                    "name": "SOFTMAX_LOSS",
                    "id": 21
                  },
                  {
                    "name": "SPLIT",
                    "id": 22
                  },
                  {
                    "name": "SLICE",
                    "id": 33
                  },
                  {
                    "name": "TANH",
                    "id": 23
                  },
                  {
                    "name": "WINDOW_DATA",
                    "id": 24
                  },
                  {
                    "name": "THRESHOLD",
                    "id": 31
                  }
                ]
              },
              {
                "name": "DimCheckMode",
                "values": [
                  {
                    "name": "STRICT",
                    "id": 0
                  },
                  {
                    "name": "PERMISSIVE",
                    "id": 1
                  }
                ]
              }
            ]
          },
          {
            "name": "V0LayerParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "string",
                "name": "name",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 2
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "num_output",
                "id": 3
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "biasterm",
                "id": 4,
                "options": {
                  "default": true
                }
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "weight_filler",
                "id": 5
              },
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "bias_filler",
                "id": 6
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "pad",
                "id": 7,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "kernelsize",
                "id": 8
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "group",
                "id": 9,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "stride",
                "id": 10,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "PoolMethod",
                "name": "pool",
                "id": 11,
                "options": {
                  "default": "MAX"
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "dropout_ratio",
                "id": 12,
                "options": {
                  "default": 0.5
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "local_size",
                "id": 13,
                "options": {
                  "default": 5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "alpha",
                "id": 14,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "beta",
                "id": 15,
                "options": {
                  "default": 0.75
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "k",
                "id": 22,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "source",
                "id": 16
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "scale",
                "id": 17,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "meanfile",
                "id": 18
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "batchsize",
                "id": 19
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "cropsize",
                "id": 20,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "mirror",
                "id": 21,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "repeated",
                "type": "BlobProto",
                "name": "blobs",
                "id": 50
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "blobs_lr",
                "id": 51
              },
              {
                "rule": "repeated",
                "type": "float",
                "name": "weight_decay",
                "id": 52
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "rand_skip",
                "id": 53,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "det_fg_threshold",
                "id": 54,
                "options": {
                  "default": 0.5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "det_bg_threshold",
                "id": 55,
                "options": {
                  "default": 0.5
                }
              },
              {
                "rule": "optional",
                "type": "float",
                "name": "det_fg_fraction",
                "id": 56,
                "options": {
                  "default": 0.25
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "det_context_pad",
                "id": 58,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "string",
                "name": "det_crop_mode",
                "id": 59,
                "options": {
                  "default": "warp"
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "new_num",
                "id": 60,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "new_channels",
                "id": 61,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "new_height",
                "id": 62,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "int32",
                "name": "new_width",
                "id": 63,
                "options": {
                  "default": 0
                }
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "shuffle_images",
                "id": 64,
                "options": {
                  "default": false
                }
              },
              {
                "rule": "optional",
                "type": "uint32",
                "name": "concat_dim",
                "id": 65,
                "options": {
                  "default": 1
                }
              },
              {
                "rule": "optional",
                "type": "HDF5OutputParameter",
                "name": "hdf5_output_param",
                "id": 1001
              }
            ],
            "enums": [
              {
                "name": "PoolMethod",
                "values": [
                  {
                    "name": "MAX",
                    "id": 0
                  },
                  {
                    "name": "AVE",
                    "id": 1
                  },
                  {
                    "name": "STOCHASTIC",
                    "id": 2
                  }
                ]
              }
            ]
          },
          {
            "name": "PReLUParameter",
            "fields": [
              {
                "rule": "optional",
                "type": "FillerParameter",
                "name": "filler",
                "id": 1
              },
              {
                "rule": "optional",
                "type": "bool",
                "name": "channel_shared",
                "id": 2,
                "options": {
                  "default": false
                }
              }
            ]
          }
        ],
        "enums": [
          {
            "name": "Phase",
            "values": [
              {
                "name": "TRAIN",
                "id": 0
              },
              {
                "name": "TEST",
                "id": 1
              }
            ]
          }
        ]
      }).build();
    
      return this.parseProto(raw, _.caffe);
    }

    abstract parseProto(data: ArrayBuffer, caffe: any);
  }
}
