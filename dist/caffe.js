var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NumJS;
(function (NumJS) {
    NumJS.DEFAULT_TYPE_INSTANCE = Float32Array;
    function zeros(n, dtype) {
        if (dtype === void 0) { dtype = NumJS.DEFAULT_TYPE_INSTANCE; }
        return new dtype(n);
    }
    NumJS.zeros = zeros;
    function fill(A, b) {
        // Note, this is faster than the native .fill() method
        for (var i = 0, len = A.length; i < len; ++i)
            A[i] = b;
        return A;
    }
    NumJS.fill = fill;
    function prod(A) {
        var prev = 1.0;
        for (var i = 0, len = A.length; i < len; ++i)
            prev *= A[i];
        return prev;
    }
    NumJS.prod = prod;
    function sum(A) {
        var prev = 0.0;
        for (var i = 0, len = A.length; i < len; ++i)
            prev += A[i];
        return prev;
    }
    NumJS.sum = sum;
    function add(A, B) {
        if (A.length === B.length) {
            for (var i = 0, len = A.length; i < len; ++i)
                A[i] += B[i];
            return A;
        }
        else {
            throw new TypeError("Bad input shapes " + A.length + " " + B.length);
        }
    }
    NumJS.add = add;
    function addConst(A, b) {
        for (var i = 0, len = A.length; i < len; ++i)
            A[i] += b;
        return A;
    }
    NumJS.addConst = addConst;
    function sub(A, B) {
        if (A.length === B.length) {
            for (var i = 0, len = A.length; i < len; ++i)
                A[i] -= B[i];
            return A;
        }
        else {
            throw new TypeError("Bad input shape " + A.length + " " + B.length);
        }
    }
    NumJS.sub = sub;
    function subConst(A, b) {
        for (var i = 0, len = A.length; i < len; ++i)
            A[i] -= b;
        return A;
    }
    NumJS.subConst = subConst;
    function mul(A, B) {
        if (A.length === B.length) {
            for (var i = 0, len = A.length; i < len; ++i)
                A[i] *= B[i];
            return A;
        }
        else {
            throw new TypeError("Bad input shape " + A.length + " " + B.length);
        }
    }
    NumJS.mul = mul;
    function mulByConst(A, b) {
        for (var i = 0, len = A.length; i < len; ++i)
            A[i] *= b;
        return A;
    }
    NumJS.mulByConst = mulByConst;
    function div(A, B) {
        if (A.length === B.length) {
            for (var i = 0, len = A.length; i < len; ++i)
                A[i] /= B[i];
            return A;
        }
        else {
            throw new TypeError("Bad input shape " + A.length + " " + B.length);
        }
    }
    NumJS.div = div;
    function divByConst(A, b) {
        for (var i = 0, len = A.length; i < len; ++i)
            A[i] /= b;
        return A;
    }
    NumJS.divByConst = divByConst;
    function addScaled(A, B, c) {
        if (A.length === B.length) {
            for (var i = 0, len = A.length; i < len; ++i)
                A[i] += c * B[i];
            return A;
        }
        else {
            throw new TypeError("Bad input shape " + A.length + " " + B.length);
        }
    }
    NumJS.addScaled = addScaled;
})(NumJS || (NumJS = {}));
var NumJS;
(function (NumJS) {
    function max(A) {
        var max_ = Number.NEGATIVE_INFINITY;
        for (var i = 0, len = A.length; i < len; ++i) {
            if (A[i] > max_) {
                max_ = A[i];
            }
        }
        return max_;
    }
    NumJS.max = max;
    function argmax(A) {
        var max_ = Number.NEGATIVE_INFINITY;
        var idx = 0;
        for (var i = 0, len = A.length; i < len; ++i) {
            if (A[i] > max_) {
                max_ = A[i];
                idx = i;
            }
        }
        return idx;
    }
    NumJS.argmax = argmax;
    function maxn(A, n) {
        n = n || 3;
        return A.slice(0).sort(function (a, b) {
            return b - a;
        }).slice(0, n);
    }
    NumJS.maxn = maxn;
    function argmaxn(A, n) {
        n = n || 3;
        var len = A.length;
        var indices = new Uint32Array(len);
        for (var i = 0; i < len; ++i)
            indices[i] = i;
        return indices.sort(function (a, b) {
            return A[b] - A[a];
        }).slice(0, n);
    }
    NumJS.argmaxn = argmaxn;
    function maxmin(w) {
        if (w.length === 0) {
            return {};
        }
        var maxv = w[0];
        var minv = w[0];
        var maxi = 0;
        var mini = 0;
        for (var i = 1, len = w.length; i < len; ++i) {
            if (w[i] > maxv) {
                maxv = w[i];
                maxi = i;
            }
            if (w[i] < minv) {
                minv = w[i];
                mini = i;
            }
        }
        return { maxi: maxi, maxv: maxv, mini: mini, minv: minv, dv: maxv - minv };
    }
    NumJS.maxmin = maxmin;
})(NumJS || (NumJS = {}));
var NumJS;
(function (NumJS) {
    var cached = false;
    var cachedVal = 0.0;
    function gaussRandom() {
        if (cached) {
            cached = false;
            return cachedVal;
        }
        var u = 2 * Math.random() - 1;
        var v = 2 * Math.random() - 1;
        var r = u * u + v * v;
        if (r == 0 || r > 1)
            return gaussRandom();
        var c = Math.sqrt(-2 * Math.log(r) / r);
        cachedVal = v * c; // cache this
        cached = true;
        return u * c;
    }
    NumJS.gaussRandom = gaussRandom;
    function randf(a, b) { return Math.random() * (b - a) + a; }
    NumJS.randf = randf;
    function randi(a, b) { return Math.floor(Math.random() * (b - a) + a); }
    NumJS.randi = randi;
    function randn(mu, std) { return mu + gaussRandom() * std; }
    NumJS.randn = randn;
    // create random permutation of numbers, in range [0...n-1]
    function randperm(n) {
        var i = n;
        var j = 0;
        var temp;
        var arr = [];
        for (var q = 0; q < n; ++q)
            arr[q] = q;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }
    NumJS.randperm = randperm;
})(NumJS || (NumJS = {}));
var NumJS;
(function (NumJS) {
    function clip(value, min, max) { return Math.max(Math.min(value, max), min); }
    NumJS.clip = clip;
    function mod(a, b) { return ((a % b) + b) % b; }
    NumJS.mod = mod;
    function tanh(x) { var y = Math.exp(2 * x); return (y - 1) / (y + 1); }
    NumJS.tanh = tanh;
})(NumJS || (NumJS = {}));
/// <reference path="Array.ts" />
/// <reference path="MinMax.ts" />
/// <reference path="Random.ts" />
/// <reference path="Utils.ts" />
/// <reference path="src/_index.ts" /> 
/// <reference path="../../NumJS/index.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var Vol = (function () {
        function Vol(sx, sy, depth, fill) {
            this.sx = sx;
            this.sy = sy;
            this.depth = depth;
            // we were given dimensions of the vol
            var n = this.sx * this.sy * this.depth;
            this.w = nj.zeros(n);
            // this.dw = nj.zeros(n);
            if (fill === undefined) {
                // weight normalization is done to equalize the output
                // variance of every neuron, otherwise neurons with a lot
                // of incoming connections have outputs of larger variance
                var scale = Math.sqrt(1.0 / n);
                for (var i = 0; i < n; ++i) {
                    this.w[i] = nj.randn(0.0, scale);
                }
            }
            else if (fill !== 0.0) {
                nj.fill(this.w, fill);
            }
        }
        Vol.fromArray = function (A) {
            // we were given a list in A, assume 1D volume and fill it up
            var vol = new Vol(1, 1, A.length, 0.0);
            vol.w.set(A);
            return vol;
        };
        Vol.prototype.clone = function () {
            var vol = new Vol(this.sx, this.sy, this.depth, 0.0);
            vol.w.set(this.w);
            return vol;
        };
        Vol.prototype.cloneAndZero = function () {
            var vol = new Vol(this.sx, this.sy, this.depth, 0.0);
            return vol;
        };
        Vol.prototype.get = function (x, y, d) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            return this.w[ix];
        };
        Vol.prototype.set = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.w[ix] = v;
        };
        Vol.prototype.add = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.w[ix] += v;
            return this;
        };
        Vol.prototype.sub = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.w[ix] -= v;
            return this;
        };
        Vol.prototype.mul = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.w[ix] *= v;
            return this;
        };
        Vol.prototype.div = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.w[ix] /= v;
            return this;
        };
        Vol.prototype.get_grad = function (x, y, d) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            return this.dw[ix];
        };
        Vol.prototype.set_grad = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.dw[ix] = v;
        };
        Vol.prototype.add_grad = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.dw[ix] += v;
        };
        Vol.prototype.sub_grad = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.dw[ix] -= v;
        };
        Vol.prototype.mul_grad = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.dw[ix] *= v;
        };
        Vol.prototype.div_grad = function (x, y, d, v) {
            var ix = ((this.sx * y) + x) * this.depth + d;
            this.dw[ix] /= v;
        };
        Vol.prototype.roll = function (ox, oy, od) {
            if (ox === void 0) { ox = 0.0; }
            if (oy === void 0) { oy = 0.0; }
            if (od === void 0) { od = 0.0; }
            var V2 = this.clone();
            for (var d = 0, depth = V2.depth; d < depth; ++d) {
                for (var x = 0, sx = V2.sx; x < sx; ++x) {
                    for (var y = 0, sy = V2.sy; y < sy; ++y) {
                        var dval = this.get(nj.mod((x + ox), this.sx), nj.mod((y + oy), this.sy), nj.mod((d + od), this.depth));
                        V2.set(x, y, d, dval);
                    }
                }
            }
            return V2;
        };
        Vol.prototype.zoom = function (zx, zy, zd) {
            if (zx === void 0) { zx = 1.0; }
            if (zy === void 0) { zy = 1.0; }
            if (zd === void 0) { zd = 1.0; }
            var V2 = new Vol(Math.round(this.sx * zx), Math.round(this.sy * zy), Math.round(this.depth * zd), 0.0);
            for (var d = 0, depth = V2.depth; d < depth; ++d) {
                for (var x = 0, sx = V2.sx; x < sx; ++x) {
                    for (var y = 0, sy = V2.sy; y < sy; ++y) {
                        var n = 0;
                        var ox = Math.ceil(1.0 / zx);
                        var oy = Math.ceil(1.0 / zy);
                        var od = Math.ceil(1.0 / zd);
                        var startx = Math.ceil(x / zx);
                        var starty = Math.ceil(y / zy);
                        var startd = Math.ceil(d / zd);
                        var endx = Math.min(startx + ox, this.sx);
                        var endy = Math.min(starty + oy, this.sy);
                        var endd = Math.min(startd + od, this.depth);
                        for (var dx = startx; dx < endx; dx++) {
                            for (var dy = starty; dy < endy; dy++) {
                                for (var dd = startd; dd < endd; dd++) {
                                    var dval = this.get(dx, dy, dd);
                                    V2.add(x, y, d, dval);
                                    n++;
                                }
                            }
                        }
                        V2.div(x, y, d, n);
                    }
                }
            }
            return V2;
        };
        Vol.prototype.toJSON = function () {
            // todo: we may want to only save d most significant digits to save space
            var json = {};
            json.sx = this.sx;
            json.sy = this.sy;
            json.depth = this.depth;
            json.w = this.w;
            return json;
            // we wont back up gradients to save space
        };
        Vol.fromJSON = function (json) {
            var vol = new Vol(json.sx, json.sy, json.depth, 0.0);
            vol.w.set(json.w);
            return vol;
        };
        return Vol;
    }());
    Net.Vol = Vol;
})(Net || (Net = {}));
/// <reference path="../../NumJS/index.ts" />
var Net;
(function (Net_1) {
    var nj = NumJS;
    var Net = (function () {
        function Net() {
        }
        Net.prototype.getLayer = function (name) {
            return this.layers.get(name);
        };
        Net.prototype.setInputDimensions = function (width, height, depth) {
            if (depth === void 0) { depth = 3; }
            this.layerIterator(function (layer, i, pred) {
                if (i === 0) {
                    layer.in_sx = width;
                    layer.in_sy = height;
                    layer.in_depth = depth;
                    layer.updateDimensions();
                }
                else {
                    layer.updateDimensions(pred);
                }
            });
        };
        Net.prototype.layerIterator = function (iteratorFn, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var layerStack = [];
            var edges = [];
            var layer;
            var i = 0;
            // Store the visited nodes
            var visited = d3.set();
            // Forward traversal
            if (params.reverse === undefined || params.reverse === false) {
                // Define the current layer
                layer = params.start ? this.layers.get(params.start) : this.layers.get('data');
                edges = this.edges;
            }
            else {
                // Define the current layer
                layer = params.start ? this.layers.get(params.start) : this.layers.values()[this.layers.size() - 1];
                edges = this.edges.map(function (d) {
                    return { from: d.to, to: d.from };
                });
            }
            // Aggregate all edges by the from property
            // Reverse edge directions
            var edgesFrom = d3.map(d3.nest()
                .key(function (d) { return d.from; })
                .entries(edges), function (d) { return d.key; });
            // Aggregate all edges by the to property
            // Reverse edge directions
            var edgesTo = d3.map(d3.nest()
                .key(function (d) { return d.to; })
                .entries(edges), function (d) { return d.key; });
            // Start with the first layer
            layerStack.push(layer);
            while (layerStack.length) {
                // Take a layer from the stack
                var layer_1 = layerStack.pop();
                // Set the layer visited
                visited.add(layer_1.name);
                // Collect the previous Layers
                var parentKeys = edgesTo.get(layer_1.name);
                var parents = parentKeys === undefined ? undefined
                    : parentKeys.values.map(function (d) { return _this.layers.get(d.from); });
                // Call the iterator callback
                iteratorFn(layer_1, i++, parents);
                // Check if we reached the end layer
                if (params.end && layer_1.name === params.end) {
                    break;
                }
                // Get all children for this layer
                var childrenKeys = edgesFrom.get(layer_1.name);
                if (childrenKeys) {
                    childrenKeys.values
                        .filter(function (d) { return !visited.has(d.to); })
                        .forEach(function (d) {
                        // Check if there are still any unvisited parents
                        // of the next child which need to be visited first
                        var parentKeysOfChild = edgesTo.get(d.to);
                        var unvisitedParents = parentKeysOfChild === undefined ? []
                            : parentKeysOfChild.values.filter(function (d) { return !visited.has(d.from); });
                        // All previous parents have been visited
                        if (unvisitedParents.length === 0) {
                            // Add the layer to the stack
                            layerStack.push(_this.layers.get(d.to));
                        }
                    });
                }
            }
        };
        Net.prototype.forward = function (V, is_training, params) {
            if (is_training === void 0) { is_training = false; }
            if (params === void 0) { params = {}; }
            var activationMap = d3.map();
            var currentActivation;
            this.layerIterator(function (layer, i, parents) {
                if (parents === undefined) {
                    currentActivation = V;
                }
                else if (parents.length > 1) {
                    currentActivation = parents.map(function (d) { return activationMap.get(d.name); });
                }
                else {
                    currentActivation = activationMap.get(parents[0].name);
                }
                currentActivation = layer.forward(currentActivation, is_training);
                activationMap.set(layer.name, currentActivation);
            }, params);
            return currentActivation;
        };
        Net.prototype.backward = function (y, params) {
            if (params === void 0) { params = {}; }
            params.reverse = true;
            var loss;
            this.layerIterator(function (layer, i, parents) {
                if (y !== undefined && i === 0) {
                    // last layer assumed to be loss layer
                    loss = layer.backward(y);
                }
                else {
                    // backprop to all other layers
                    layer.backward();
                }
            }, params);
            return loss;
        };
        Net.prototype.debugStructure = function () {
            var numParams = 0;
            var f = d3.format('s');
            var f2 = d3.format(',d');
            var numLayers = 0;
            this.layerIterator(function (layer, i, pred) {
                var numParamsPerLayer = nj.sum(layer.getNumParameters());
                var str = "";
                str += layer.getOutputShape().join('x') + " :: ";
                str += layer.getDescription().join(' ');
                if (numParamsPerLayer) {
                    numParams += numParamsPerLayer;
                    str += " => " + f2(numParamsPerLayer) + ' parameters';
                }
                //if (['relu', 'tanh', 'sigmoid'].indexOf(layer.layer_type) === -1) {
                numLayers += 1;
                console.log(str);
                //}
            });
            console.log('---');
            console.log('Total number of layers ' + f2(numLayers));
            console.log('Total number of params ' + f2(numParams) + ' (memory: ' + f(numParams * 4) + 'b): ');
        };
        return Net;
    }());
    Net_1.Net = Net;
})(Net || (Net = {}));
var Parser;
(function (Parser) {
    var TextParser = (function () {
        function TextParser() {
        }
        TextParser.prototype.fetch = function (url) {
            var req = new Request(url);
            return fetch(req).then(function (response) { return response.text(); });
        };
        TextParser.prototype.parse = function (url) {
            var _this = this;
            return this.fetch(url).then(function (response) { return _this.parseString(response); });
        };
        return TextParser;
    }());
    Parser.TextParser = TextParser;
})(Parser || (Parser = {}));
var Parser;
(function (Parser) {
    var BinaryParser = (function () {
        function BinaryParser() {
        }
        BinaryParser.prototype.fetch = function (url) {
            var req = new Request(url);
            return fetch(req).then(function (response) { return response.arrayBuffer(); });
        };
        BinaryParser.prototype.parse = function (url) {
            var _this = this;
            return this.fetch(url).then(function (response) { return _this.parseBuffer(response); });
        };
        return BinaryParser;
    }());
    Parser.BinaryParser = BinaryParser;
})(Parser || (Parser = {}));
/// <reference path="TextParser.ts" />
var Parser;
(function (Parser) {
    var PrototxtParser = (function (_super) {
        __extends(PrototxtParser, _super);
        function PrototxtParser() {
            _super.apply(this, arguments);
        }
        PrototxtParser.prototype.parseString = function (raw) {
            return this.parsePrototxt(raw);
        };
        PrototxtParser.prototype.parsePrototxt = function (raw, level) {
            if (level === void 0) { level = 0; }
            var json = {};
            var match;
            if (level == 0) {
                var regexVal = /(?:^|\n)(\w+):\s"*([\w/.]+)"*/gi;
                var regexObj = /(?:^|\n)(\w+)\s\{([\S\s]*?)\n\}/gi;
            }
            else {
                var indent = '(?:^|\\n)\\s{' + level + '}';
                var key = '(\\w+)';
                var regexVal = new RegExp(indent + key + '\\s*:\\s*"*([\\w/.]+)"*', "gi");
                var regexObj = new RegExp(indent + key + '\\s*\\{\\s*\\n([\\s\\S]*?)\\n\\s{' + level + '}\\}', "gi");
            }
            while (match = regexVal.exec(raw)) {
                var key = match[1];
                var value = match[2];
                if (json[key] !== undefined) {
                    if (Array.isArray(json[key])) {
                        json[key].push(value);
                    }
                    else {
                        json[key] = [json[key]];
                        json[key].push(value);
                    }
                }
                else {
                    json[match[1]] = value;
                }
            }
            while (match = regexObj.exec(raw)) {
                var key = match[1];
                var value = this.parsePrototxt(match[2], level + 2);
                if (json[key] !== undefined) {
                    if (Array.isArray(json[key])) {
                        json[key].push(value);
                    }
                    else {
                        json[key] = [json[key]];
                        json[key].push(value);
                    }
                }
                else {
                    json[key] = value;
                }
            }
            return json;
        };
        return PrototxtParser;
    }(Parser.TextParser));
    Parser.PrototxtParser = PrototxtParser;
})(Parser || (Parser = {}));
/// <reference path="Protobuf.d.ts" />
/// <reference path="BinaryParser.ts" />
var Parser;
(function (Parser) {
    var BinaryprotoParser = (function (_super) {
        __extends(BinaryprotoParser, _super);
        function BinaryprotoParser() {
            _super.apply(this, arguments);
        }
        BinaryprotoParser.prototype.parseBuffer = function (raw) {
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
        };
        return BinaryprotoParser;
    }(Parser.BinaryParser));
    Parser.BinaryprotoParser = BinaryprotoParser;
})(Parser || (Parser = {}));
/// <reference path="BinaryprotoParser.ts" />
/// <reference path="../../Net/index.ts" />
var Parser;
(function (Parser) {
    var BlobProtoParser = (function (_super) {
        __extends(BlobProtoParser, _super);
        function BlobProtoParser() {
            _super.apply(this, arguments);
        }
        BlobProtoParser.prototype.parseProto = function (rawData, protoParser) {
            // Decode the protobuf data
            var blob = protoParser.BlobProto.decode(rawData);
            var sx = blob.width, sy = blob.height, depth = blob.channels;
            var data = blob.data;
            // Generate a new Vol from the blob data
            var vol = new Net.Vol(sx, sy, depth, 0.0);
            for (var d = 0; d < depth; d++) {
                for (var y = 0; y < sy; y++) {
                    for (var x = 0; x < sx; x++) {
                        var ix = ((sy * d) + y) * sx + x;
                        vol.set(x, y, d, data[ix]);
                    }
                }
            }
            return vol;
        };
        return BlobProtoParser;
    }(Parser.BinaryprotoParser));
    Parser.BlobProtoParser = BlobProtoParser;
})(Parser || (Parser = {}));
/// <reference path="TextParser.ts" />
/// <reference path="BinaryParser.ts" />
/// <reference path="PrototxtParser.ts" />
/// <reference path="BinaryprotoParser.ts" />
/// <reference path="BlobProtoParser.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="../../NumJS/index.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    // sample from list lst according to probabilities in list probs
    // the two lists are of same size, and probs adds up to 1
    function weightedSample(lst, probs) {
        var p = nj.randf(0, 1.0);
        var cumprob = 0.0;
        for (var k = 0, n = lst.length; k < n; k++) {
            cumprob += probs[k];
            if (p < cumprob) {
                return lst[k];
            }
        }
    }
    Net.weightedSample = weightedSample;
    // syntactic sugar function for getting default parameter values
    function getopt(opt, field_name, default_value) {
        if (opt === void 0) { opt = {}; }
        if (typeof field_name === 'string') {
            // case of single string
            return (opt[field_name] !== undefined) ? opt[field_name] : default_value;
        }
        else {
            // assume we are given a list of string instead
            var ret = default_value;
            field_name.forEach(function (f) {
                ret = opt[f] !== undefined ? opt[f] : ret;
            });
            return ret;
        }
    }
    Net.getopt = getopt;
    function assert(condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }
    Net.assert = assert;
    function arrContains(arr, elt) {
        for (var i = 0, n = arr.length; i < n; i++) {
            if (arr[i] === elt)
                return true;
        }
        return false;
    }
    Net.arrContains = arrContains;
    function arrUnique(arr) {
        var b = [];
        for (var i = 0, n = arr.length; i < n; i++) {
            if (!arrContains(b, arr[i])) {
                b.push(arr[i]);
            }
        }
        return b;
    }
    Net.arrUnique = arrUnique;
})(Net || (Net = {}));
/// <reference path="../../../NumJS/index.ts" />
/// <reference path="../Vol.ts" />
/// <reference path="../ILayer.ts" />
/// <reference path="../Utils.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var BaseLayer = (function () {
        function BaseLayer(opt) {
            this.in_depth = 1;
            this.in_sy = 1;
            this.in_sx = 1;
            this.out_depth = 1;
            this.out_sy = 1;
            this.out_sx = 1;
            this.name = opt.name !== undefined ? opt.name : "";
            this.input = opt.input !== undefined ? opt.input : undefined;
            this.output = opt.output !== undefined ? opt.output : undefined;
            if (!opt.pred) {
                this.in_sx = opt.in_sx;
                this.in_sy = opt.in_sy;
                this.in_depth = opt.in_depth;
            }
        }
        BaseLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.out_sx = this.in_sx;
            this.out_sy = this.in_sy;
            this.out_depth = this.in_depth;
        };
        BaseLayer.prototype.resetGradient = function () {
            if (this.in_act instanceof Array) {
                for (var j = 0; j < this.in_act.length; j++) {
                    this.in_act[j].dw = nj.zeros(this.in_act[j].w.length);
                }
            }
            else {
                this.in_act.dw = nj.zeros(this.in_act.w.length);
            }
        };
        BaseLayer.prototype.getNumParameters = function () {
            return [0, 0];
        };
        BaseLayer.prototype.getOutputShape = function () {
            return [this.in_depth, this.in_sy, this.in_sx];
        };
        BaseLayer.prototype.getDescription = function () {
            return [this.layer_type.toUpperCase(), this.name];
        };
        BaseLayer.prototype.getParamsAndGrads = function () {
            return [];
        };
        BaseLayer.prototype.toJSON = function () {
            var json = {};
            json.out_depth = this.out_depth;
            json.out_sx = this.out_sx;
            json.out_sy = this.out_sy;
            json.layer_type = this.layer_type;
            json.name = this.name;
            json.output = this.output;
            json.input = this.input;
            return json;
        };
        BaseLayer.prototype.fromJSON = function (json) {
            this.out_depth = json.out_depth;
            this.out_sx = json.out_sx;
            this.out_sy = json.out_sy;
            this.layer_type = json.layer_type;
            this.name = json.name;
            this.output = json.output;
            this.input = json.input;
        };
        return BaseLayer;
    }());
    Net.BaseLayer = BaseLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var InputLayer = (function (_super) {
        __extends(InputLayer, _super);
        function InputLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'input';
            // required: depth
            this.in_depth = Net.getopt(opt, ['in_depth', 'out_depth', 'depth'], 0);
            // optional: default these dimensions to 1
            this.in_sx = Net.getopt(opt, ['in_sx', 'out_sx', 'sx', 'width'], 1);
            this.in_sy = Net.getopt(opt, ['in_sy', 'out_sy', 'sy', 'height'], 1);
            this.updateDimensions();
        }
        InputLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            this.out_act = V;
            return this.out_act; // simply identity function for now
        };
        InputLayer.prototype.backward = function () { };
        return InputLayer;
    }(Net.BaseLayer));
    Net.InputLayer = InputLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var ConcatLayer = (function (_super) {
        __extends(ConcatLayer, _super);
        function ConcatLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'concat';
            this.axis = Net.getopt(opt, ['axis'], 1);
            this.updateDimensions(opt.pred);
        }
        ConcatLayer.prototype.forward = function (Vs, is_training) {
            this.in_act = Vs;
            this.resetGradient();
            var V2 = new Net.Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
            var offset = 0;
            if (this.axis === 0) {
                var V2w = V2.w;
                for (var j = 0; j < Vs.length; j++) {
                    V2w.set(Vs[j].w, offset);
                    offset += Vs[j].w.length;
                }
            }
            else {
                for (var j_1 = 0; j_1 < Vs.length; j_1++) {
                    var V = Vs[j_1];
                    for (var d = 0; d < V.depth; d++)
                        for (var x = 0; x < V.sx; x++) {
                            for (var y = 0; y < V.sy; y++) {
                                V2.set(x, y, d + offset, V.get(x, y, d));
                            }
                        }
                    offset += V.depth;
                }
            }
            this.out_act = V2;
            return this.out_act;
        };
        ConcatLayer.prototype.backward = function () {
            var Vs = this.in_act; // we need to set dw of these
            var V2 = this.out_act;
            var offset = 0;
            if (this.axis === 0) {
                var V2dw = V2.dw;
                for (var j = 0; j < Vs.length; j++) {
                    var Vdw = Vs[j].dw;
                    Vdw = nj.add(Vdw, V2dw.slice(offset, offset + Vdw.length));
                    offset += Vdw.length;
                }
            }
            else {
                for (var j = 0, len = Vs.length; j < len; ++j) {
                    var V = Vs[j];
                    var Vdw = Vs[j].dw;
                    for (var d = 0, depth = V.depth; d < depth; ++d)
                        for (var x = 0, sx = V.sx; x < sx; ++x) {
                            for (var y = 0, sy = V.sy; y < sy; ++y) {
                                V.add_grad(x, y, d, V2.get_grad(x, y, d + offset));
                            }
                        }
                    offset += V.depth;
                }
            }
        };
        ConcatLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                // concatenation along num
                // (n_1 + n_2 + ... + n_K) * c_1 * h * w, and all input c_i should be the same.
                if (this.axis == 0) {
                    this.in_sx = pred[0].in_sx;
                    this.in_sy = pred[0].in_sy;
                    this.in_depth = pred[0].in_depth;
                }
                else {
                    this.in_sx = pred[0].in_sx;
                    this.in_sy = pred[0].in_sy;
                    this.in_depth = nj.sum(pred.map(function (d) { return d.out_depth; }));
                }
            }
            this.out_sx = this.in_sx;
            this.out_sy = this.in_sy;
            this.out_depth = this.in_depth;
        };
        ConcatLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.axis = this.axis;
            return json;
        };
        ConcatLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.axis = json.axis;
        };
        return ConcatLayer;
    }(Net.BaseLayer));
    Net.ConcatLayer = ConcatLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var ConvLayer = (function (_super) {
        __extends(ConvLayer, _super);
        function ConvLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'conv';
            // required
            this.out_depth = opt.filters;
            // filter size. Should be odd if possible, it's cleaner.
            this.sx = opt.sx;
            // optional
            this.sy = Net.getopt(opt, ['sy'], this.sx);
            // stride at which we apply filters to input volume
            this.stride = Net.getopt(opt, ['stride'], 1);
            // amount of 0 padding to add around borders of input volume
            this.pad = Net.getopt(opt, ['pad'], 0);
            this.l1_decay_mul = Net.getopt(opt, ['l1_decay_mul'], 0.0);
            this.l2_decay_mul = Net.getopt(opt, ['l2_decay_mul'], 1.0);
            this.updateDimensions(opt.pred);
            // initialize bias
            var bias = Net.getopt(opt, ['bias_pref'], 0.0);
            this.biases = new Net.Vol(1, 1, this.out_depth, bias);
            // initialize filters
            this.filters = [];
            for (var i = 0; i < this.out_depth; ++i) {
                this.filters.push(new Net.Vol(this.sx, this.sy, this.in_depth, 0.0));
            }
        }
        ConvLayer.prototype.resetGradient = function () {
            _super.prototype.resetGradient.call(this);
            for (var i = 0; i < this.out_depth; ++i) {
                this.filters[i].dw = nj.zeros(this.filters[i].w.length);
            }
            this.biases.dw = nj.zeros(this.out_depth);
        };
        ConvLayer.prototype.forward = function (V, is_training) {
            // optimized code by @mdda that achieves 2x speedup over previous version
            this.in_act = V;
            this.resetGradient();
            var A = new Net.Vol(this.out_sx | 0, this.out_sy | 0, this.out_depth | 0, 0.0);
            var V_sx = V.sx | 0;
            var V_sy = V.sy | 0;
            var xy_stride = this.stride | 0;
            for (var d = 0; d < this.out_depth; ++d) {
                var f = this.filters[d];
                var x = -this.pad | 0;
                var y = -this.pad | 0;
                for (var ay = 0; ay < this.out_sy; y += xy_stride, ++ay) {
                    x = -this.pad | 0;
                    for (var ax = 0; ax < this.out_sx; x += xy_stride, ++ax) {
                        // convolve centered at this particular location
                        var a = 0.0;
                        for (var fy = 0; fy < f.sy; ++fy) {
                            var oy = y + fy; // coordinates in the original input array coordinates
                            for (var fx = 0; fx < f.sx; ++fx) {
                                var ox = x + fx;
                                if (oy >= 0 && oy < V_sy && ox >= 0 && ox < V_sx) {
                                    for (var fd = 0; fd < f.depth; ++fd) {
                                        // avoid function call overhead (x2) for efficiency, compromise modularity :(
                                        a += f.w[((f.sx * fy) + fx) * f.depth + fd] * V.w[((V_sx * oy) + ox) * V.depth + fd];
                                    }
                                }
                            }
                        }
                        a += this.biases.w[d];
                        A.set(ax, ay, d, a);
                    }
                }
            }
            this.out_act = A;
            return this.out_act;
        };
        ConvLayer.prototype.backward = function () {
            var V = this.in_act;
            var V_sx = V.sx | 0;
            var V_sy = V.sy | 0;
            var xy_stride = this.stride | 0;
            for (var d = 0; d < this.out_depth; ++d) {
                var f = this.filters[d];
                var x = -this.pad | 0;
                var y = -this.pad | 0;
                for (var ay = 0; ay < this.out_sy; y += xy_stride, ++ay) {
                    x = -this.pad | 0;
                    for (var ax = 0; ax < this.out_sx; x += xy_stride, ++ax) {
                        // convolve centered at this particular location
                        var chain_grad = this.out_act.get_grad(ax, ay, d); // gradient from above, from chain rule
                        for (var fy = 0; fy < f.sy; ++fy) {
                            var oy = y + fy; // coordinates in the original input array coordinates
                            for (var fx = 0; fx < f.sx; ++fx) {
                                var ox = x + fx;
                                if (oy >= 0 && oy < V_sy && ox >= 0 && ox < V_sx) {
                                    for (var fd = 0; fd < f.depth; ++fd) {
                                        // avoid function call overhead (x2) for efficiency, compromise modularity :(
                                        var ix1 = ((V_sx * oy) + ox) * V.depth + fd;
                                        var ix2 = ((f.sx * fy) + fx) * f.depth + fd;
                                        f.dw[ix2] += V.w[ix1] * chain_grad;
                                        V.dw[ix1] += f.w[ix2] * chain_grad;
                                    }
                                }
                            }
                        }
                        this.biases.dw[d] += chain_grad;
                    }
                }
            }
        };
        ConvLayer.prototype.getParamsAndGrads = function () {
            var response = [];
            for (var i = 0; i < this.out_depth; i++) {
                response.push({
                    params: this.filters[i].w,
                    grads: this.filters[i].dw,
                    l2_decay_mul: this.l2_decay_mul,
                    l1_decay_mul: this.l1_decay_mul
                });
            }
            response.push({
                params: this.biases.w,
                grads: this.biases.dw,
                l1_decay_mul: 0.0,
                l2_decay_mul: 0.0
            });
            return response;
        };
        ConvLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            var s = this.getOutputShape();
            this.out_sx = s[1];
            this.out_sy = s[2];
        };
        ConvLayer.prototype.getNumParameters = function () {
            return [this.in_depth * this.sx * this.sy * this.out_depth, this.out_depth];
        };
        ConvLayer.prototype.getOutputShape = function () {
            return [
                this.out_depth,
                Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1),
                Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1),
            ];
        };
        ConvLayer.prototype.getDescription = function () {
            return _super.prototype.getDescription.call(this).concat([
                [this.out_depth, this.sy, this.sx].join('x') + ' Stride ' + this.stride + ' Pad ' + this.pad
            ]);
        };
        ConvLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.sx = this.sx; // filter size in x, y dims
            json.sy = this.sy;
            json.stride = this.stride;
            json.in_depth = this.in_depth;
            json.l1_decay_mul = this.l1_decay_mul;
            json.l2_decay_mul = this.l2_decay_mul;
            json.pad = this.pad;
            json.filters = [];
            for (var i = 0; i < this.filters.length; i++) {
                json.filters.push(this.filters[i].toJSON());
            }
            json.biases = this.biases.toJSON();
            return json;
        };
        ConvLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.sx = json.sx; // filter size in x, y dims
            this.sy = json.sy;
            this.stride = json.stride;
            this.in_depth = json.in_depth; // depth of input volume
            this.filters = [];
            this.l1_decay_mul = json.l1_decay_mul !== undefined ? json.l1_decay_mul : 0.0;
            this.l2_decay_mul = json.l2_decay_mul !== undefined ? json.l2_decay_mul : 1.0;
            this.pad = json.pad !== undefined ? json.pad : 0;
            for (var i = 0; i < json.filters.length; i++) {
                this.filters.push(Net.Vol.fromJSON(json.filters[i]));
            }
            this.biases = Net.Vol.fromJSON(json.biases);
        };
        return ConvLayer;
    }(Net.BaseLayer));
    Net.ConvLayer = ConvLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var PoolLayer = (function (_super) {
        __extends(PoolLayer, _super);
        function PoolLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'pool';
            // required
            this.out_depth = opt.filters;
            // filter size. Should be odd if possible, it's cleaner.
            this.sx = opt.sx;
            this.pool = Net.getopt(opt, ['pool'], 'MAX');
            ;
            // optional
            this.sy = Net.getopt(opt, ['sy'], this.sx);
            // stride at which we apply filters to input volume
            this.stride = Net.getopt(opt, ['stride'], 1);
            // amount of 0 padding to add around borders of input volume
            this.pad = Net.getopt(opt, ['pad'], 0);
            this.updateDimensions(opt.pred);
        }
        PoolLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            this.switchx = nj.zeros(this.out_sx * this.out_sy * this.out_depth);
            this.switchy = nj.zeros(this.out_sx * this.out_sy * this.out_depth);
            var A = new Net.Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
            if (this.pool === 'AVE') {
                var n_1 = this.sx * this.sy;
                for (var d_1 = 0; d_1 < this.out_depth; ++d_1) {
                    for (var ax_1 = 0; ax_1 < this.out_sx; ++ax_1) {
                        for (var ay_1 = 0; ay_1 < this.out_sy; ++ay_1) {
                            var v_1 = 0.0;
                            var xstart = ax_1 * this.stride - this.pad;
                            var ystart = ay_1 * this.stride - this.pad;
                            var xend = Math.min(xstart + this.sx, V.sx + this.pad);
                            var yend = Math.min(ystart + this.sy, V.sy + this.pad);
                            xstart = Math.max(xstart, 0);
                            ystart = Math.max(ystart, 0);
                            xend = Math.min(xend, V.sx);
                            yend = Math.min(yend, V.sy);
                            var pool_size = (xend - xstart) * (yend - ystart);
                            // perform average pooling
                            for (var x_1 = xstart; x_1 < xend; ++x_1) {
                                for (var y_1 = ystart; y_1 < yend; ++y_1) {
                                    v_1 += V.get(x_1, y_1, d_1);
                                }
                            }
                            A.set(ax_1, ay_1, d_1, v_1 / pool_size);
                        }
                    }
                }
            }
            else {
                var n = 0; // a counter for switches
                for (var d = 0; d < this.out_depth; ++d) {
                    var x = -this.pad;
                    var y = -this.pad;
                    for (var ax = 0; ax < this.out_sx; x += this.stride, ax++) {
                        y = -this.pad;
                        for (var ay = 0; ay < this.out_sy; y += this.stride, ay++) {
                            // convolve centered at this particular location
                            var a = -99999; // hopefully small enough ;\
                            var winx = -1, winy = -1;
                            for (var fx = 0; fx < this.sx; ++fx) {
                                for (var fy = 0; fy < this.sy; ++fy) {
                                    var oy = y + fy;
                                    var ox = x + fx;
                                    if (oy >= 0 && oy < V.sy && ox >= 0 && ox < V.sx) {
                                        var v = V.get(ox, oy, d);
                                        // perform max pooling and store pointers to where
                                        // the max came from. This will speed up backprop 
                                        // and can help make nice visualizations in future
                                        if (v > a) {
                                            a = v;
                                            winx = ox;
                                            winy = oy;
                                        }
                                    }
                                }
                            }
                            this.switchx[n] = winx;
                            this.switchy[n] = winy;
                            n++;
                            A.set(ax, ay, d, a);
                        }
                    }
                }
            }
            this.out_act = A;
            return this.out_act;
        };
        PoolLayer.prototype.backward = function () {
            // pooling layers have no parameters, so simply compute 
            // gradient wrt data here
            var V = this.in_act;
            var A = this.out_act; // computed in forward pass 
            if (this.pool === 'AVE') {
            }
            else {
                var n = 0;
                for (var d = 0; d < this.out_depth; ++d) {
                    var x = -this.pad;
                    for (var ax = 0; ax < this.out_sx; x += this.stride, ax++) {
                        var y = -this.pad;
                        for (var ay = 0; ay < this.out_sy; y += this.stride, ay++) {
                            var chain_grad = this.out_act.get_grad(ax, ay, d);
                            V.add_grad(this.switchx[n], this.switchy[n], d, chain_grad);
                            n++;
                        }
                    }
                }
            }
        };
        PoolLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            var s = this.getOutputShape();
            this.out_sx = s[1];
            this.out_sy = s[2];
            this.out_depth = this.in_depth;
        };
        PoolLayer.prototype.getOutputShape = function () {
            return [
                this.out_depth,
                // using ceil do to Caffe compatibility
                // https://github.com/BVLC/caffe/issues/1318
                // https://github.com/BVLC/caffe/issues/4252
                Math.ceil((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1),
                Math.ceil((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1),
            ];
        };
        PoolLayer.prototype.getDescription = function () {
            return [
                this.pool + " " + this.layer_type.toUpperCase(),
                this.name,
                [this.sy, this.sx].join('x') + ' Stride ' + this.stride + ' Pad ' + this.pad
            ];
        };
        PoolLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.sx = this.sx;
            json.sy = this.sy;
            json.stride = this.stride;
            json.pool = this.pool;
            json.in_depth = this.in_depth;
            json.pad = this.pad;
            return json;
        };
        PoolLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.pool = json.pool !== undefined ? json.pool : 'MAX';
            this.sx = json.sx;
            this.sy = json.sy;
            this.stride = json.stride;
            this.in_depth = json.in_depth;
            this.pad = json.pad !== undefined ? json.pad : 0; // backwards compatibility
            this.switchx = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array); // need to re-init these appropriately
            this.switchy = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array);
        };
        return PoolLayer;
    }(Net.BaseLayer));
    Net.PoolLayer = PoolLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    var FullyConnectedLayer = (function (_super) {
        __extends(FullyConnectedLayer, _super);
        function FullyConnectedLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'fc';
            this.sx = 1;
            this.sy = 1;
            // required
            // ok fine we will allow 'filters' as the word as well
            this.out_depth = opt.num_neurons !== undefined ? opt.num_neurons : opt.filters;
            // optional 
            this.l1_decay_mul = Net.getopt(opt, ['l1_decay_mul'], 0.0);
            this.l2_decay_mul = Net.getopt(opt, ['l2_decay_mul'], 1.0);
            this.updateDimensions(opt.pred);
            // initialize bias
            var bias = Net.getopt(opt, ['bias_pref'], 0.0);
            this.biases = new Net.Vol(1, 1, this.out_depth, bias);
            // initialize filters
            this.filters = [];
            for (var i = 0; i < this.out_depth; ++i) {
                this.filters.push(new Net.Vol(1, 1, this.num_inputs, 0.0));
            }
            if (opt.filters !== undefined) {
                for (var i = 0; i < this.out_depth; ++i) {
                    this.filters[i].w.set(opt.filters[i]);
                }
            }
            if (opt.biases !== undefined) {
                this.biases.w.set(opt.biases);
            }
        }
        FullyConnectedLayer.prototype.resetGradient = function () {
            _super.prototype.resetGradient.call(this);
            for (var i = 0; i < this.out_depth; ++i) {
                this.filters[i].dw = nj.zeros(this.filters[i].w.length);
            }
            this.biases.dw = nj.zeros(this.out_depth);
        };
        FullyConnectedLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var A = new Net.Vol(1, 1, this.out_depth, 0.0);
            var Vw = V.w;
            for (var i = 0; i < this.out_depth; ++i) {
                var a = 0.0;
                var wi = this.filters[i].w;
                for (var d = 0; d < this.num_inputs; ++d) {
                    a += Vw[d] * wi[d]; // for efficiency use Vols directly for now
                }
                a += this.biases.w[i];
                A.w[i] = a;
            }
            this.out_act = A;
            return this.out_act;
        };
        FullyConnectedLayer.prototype.backward = function () {
            var V = this.in_act;
            // compute gradient wrt weights and data
            for (var i = 0; i < this.out_depth; ++i) {
                var tfi = this.filters[i];
                var chain_grad = this.out_act.dw[i];
                for (var d = 0; d < this.num_inputs; ++d) {
                    V.dw[d] += tfi.w[d] * chain_grad; // grad wrt input data
                    tfi.dw[d] += V.w[d] * chain_grad; // grad wrt params
                }
                this.biases.dw[i] += chain_grad;
            }
        };
        FullyConnectedLayer.prototype.getParamsAndGrads = function () {
            var response = [];
            for (var i = 0; i < this.out_depth; ++i) {
                response.push({
                    params: this.filters[i].w,
                    grads: this.filters[i].dw,
                    l1_decay_mul: this.l1_decay_mul,
                    l2_decay_mul: this.l2_decay_mul
                });
            }
            response.push({
                params: this.biases.w,
                grads: this.biases.dw,
                l1_decay_mul: 0.0,
                l2_decay_mul: 0.0
            });
            return response;
        };
        FullyConnectedLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
        };
        FullyConnectedLayer.prototype.getNumParameters = function () {
            return [this.in_depth * this.in_sx * this.in_sy * this.out_depth, this.out_depth];
        };
        FullyConnectedLayer.prototype.getOutputShape = function () {
            return [this.out_depth, 1, 1];
        };
        FullyConnectedLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.num_inputs = this.num_inputs;
            json.l1_decay_mul = this.l1_decay_mul;
            json.l2_decay_mul = this.l2_decay_mul;
            json.filters = [];
            for (var i = 0; i < this.filters.length; i++) {
                json.filters.push(this.filters[i].toJSON());
            }
            json.biases = this.biases.toJSON();
            return json;
        };
        FullyConnectedLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.num_inputs = json.num_inputs;
            this.l1_decay_mul = json.l1_decay_mul !== undefined ? json.l1_decay_mul : 1.0;
            this.l2_decay_mul = json.l2_decay_mul !== undefined ? json.l2_decay_mul : 1.0;
            this.filters = [];
            for (var i = 0; i < json.filters.length; i++) {
                this.filters.push(Net.Vol.fromJSON(json.filters[i]));
            }
            this.biases = Net.Vol.fromJSON(json.biases);
        };
        return FullyConnectedLayer;
    }(Net.BaseLayer));
    Net.FullyConnectedLayer = FullyConnectedLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    // An inefficient dropout layer
    // Note this is not most efficient implementation since the layer before
    // computed all these activations and now we're just going to drop them :(
    // same goes for backward pass. Also, if we wanted to be efficient at test time
    // we could equivalently be clever and upscale during train and copy pointers during test
    // todo: make more efficient.
    var DropoutLayer = (function (_super) {
        __extends(DropoutLayer, _super);
        function DropoutLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'dropout';
            this.drop_prob = Net.getopt(opt, ['drop_prob'], 0.5);
            this.updateDimensions(opt.pred);
        }
        DropoutLayer.prototype.forward = function (V, is_training) {
            if (is_training === void 0) { is_training = false; }
            this.in_act = V;
            this.resetGradient();
            this.dropped = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Int8Array);
            var V2 = V.clone();
            var N = V.w.length;
            if (is_training) {
                // do dropout
                for (var i = 0; i < N; i++) {
                    // drop!
                    if (Math.random() < this.drop_prob) {
                        V2.w[i] = 0;
                        this.dropped[i] = 1;
                    }
                    else {
                        // scale the activations during training
                        V2.w[i] *= this.drop_prob;
                    }
                }
            }
            this.out_act = V2;
            return this.out_act; // dummy identity function for now
        };
        DropoutLayer.prototype.backward = function () {
            var V = this.in_act; // we need to set dw of this
            var chain_grad = this.out_act;
            var N = V.w.length;
            for (var i = 0; i < N; i++) {
                if (this.dropped[i] !== 1) {
                    V.dw[i] += chain_grad.dw[i]; // copy over the gradient
                }
            }
        };
        DropoutLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.drop_prob = this.drop_prob;
            return json;
        };
        DropoutLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.drop_prob = json.drop_prob;
        };
        return DropoutLayer;
    }(Net.BaseLayer));
    Net.DropoutLayer = DropoutLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    // Implements Tanh nnonlinearity elementwise
    // x -> tanh(x) 
    // so the output is between -1 and 1.
    var TanhLayer = (function (_super) {
        __extends(TanhLayer, _super);
        function TanhLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'tanh';
            this.updateDimensions(opt.pred);
        }
        TanhLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var V2 = V.cloneAndZero();
            var N = V.w.length;
            for (var i = 0; i < N; i++) {
                V2.w[i] = nj.tanh(V.w[i]);
            }
            this.out_act = V2;
            return this.out_act;
        };
        TanhLayer.prototype.backward = function () {
            var V = this.in_act; // we need to set dw of this
            var V2 = this.out_act;
            var N = V.w.length;
            for (var i = 0; i < N; i++) {
                var v2wi = V2.w[i];
                V.dw[i] += (1.0 - v2wi * v2wi) * V2.dw[i];
            }
        };
        return TanhLayer;
    }(Net.BaseLayer));
    Net.TanhLayer = TanhLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    // Implements Maxout nnonlinearity that computes
    // x -> max(x)
    // where x is a vector of size group_size. Ideally of course,
    // the input size should be exactly divisible by group_size
    var MaxoutLayer = (function (_super) {
        __extends(MaxoutLayer, _super);
        function MaxoutLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'maxout';
            // required
            this.group_size = opt.group_size !== undefined ? opt.group_size : 2;
            this.updateDimensions(opt.pred);
        }
        MaxoutLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            this.switches = nj.zeros(this.out_sx * this.out_sy * this.out_depth, Uint32Array); // useful for backprop
            var N = this.out_depth;
            var V2 = new Net.Vol(this.out_sx, this.out_sy, this.out_depth, 0.0);
            // optimization branch. If we're operating on 1D arrays we dont have
            // to worry about keeping track of x,y,d coordinates inside
            // input volumes. In convnets we do :(
            if (this.out_sx === 1 && this.out_sy === 1) {
                for (var i = 0; i < N; i++) {
                    var ix = i * this.group_size; // base index offset
                    var a = V.w[ix];
                    var ai = 0;
                    for (var j = 1; j < this.group_size; j++) {
                        var a2 = V.w[ix + j];
                        if (a2 > a) {
                            a = a2;
                            ai = j;
                        }
                    }
                    V2.w[i] = a;
                    this.switches[i] = ix + ai;
                }
            }
            else {
                var n = 0; // counter for switches
                for (var x = 0; x < V.sx; x++) {
                    for (var y = 0; y < V.sy; y++) {
                        for (var i = 0; i < N; i++) {
                            var ix = i * this.group_size;
                            var a = V.get(x, y, ix);
                            var ai = 0;
                            for (var j = 1; j < this.group_size; j++) {
                                var a2 = V.get(x, y, ix + j);
                                if (a2 > a) {
                                    a = a2;
                                    ai = j;
                                }
                            }
                            V2.set(x, y, i, a);
                            this.switches[n] = ix + ai;
                            n++;
                        }
                    }
                }
            }
            this.out_act = V2;
            return this.out_act;
        };
        MaxoutLayer.prototype.backward = function () {
            var V = this.in_act; // we need to set dw of this
            var V2 = this.out_act;
            var N = this.out_depth;
            // pass the gradient through the appropriate switch
            if (this.out_sx === 1 && this.out_sy === 1) {
                for (var i = 0; i < N; i++) {
                    var chain_grad = V2.dw[i];
                    V.dw[this.switches[i]] += chain_grad;
                }
            }
            else {
                // bleh okay, lets do this the hard way
                var n = 0; // counter for switches
                for (var x = 0; x < V2.sx; x++) {
                    for (var y = 0; y < V2.sy; y++) {
                        for (var i = 0; i < N; i++) {
                            var chain_grad = V2.get_grad(x, y, i);
                            V.add_grad(x, y, this.switches[n], chain_grad);
                            n++;
                        }
                    }
                }
            }
        };
        MaxoutLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.out_sx = this.in_sx;
            this.out_sy = this.in_sy;
            this.out_depth = Math.floor(this.in_depth / this.group_size);
        };
        MaxoutLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.group_size = this.group_size;
            return json;
        };
        MaxoutLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.group_size = json.group_size;
        };
        return MaxoutLayer;
    }(Net.BaseLayer));
    Net.MaxoutLayer = MaxoutLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    // Implements ReLU nonlinearity elementwise
    // x -> max(0, x)
    // the output is in [0, inf)
    var ReluLayer = (function (_super) {
        __extends(ReluLayer, _super);
        function ReluLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'relu';
            this.updateDimensions(opt.pred);
        }
        ReluLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var V2 = V.clone();
            var N = V.w.length;
            var V2w = V2.w;
            for (var i = 0; i < N; i++) {
                if (V2w[i] < 0)
                    V2w[i] = 0; // threshold at 0
            }
            this.out_act = V2;
            return this.out_act;
        };
        ReluLayer.prototype.backward = function () {
            var V = this.in_act; // we need to set dw of this
            var V2 = this.out_act;
            var N = V.w.length;
            for (var i = 0; i < N; i++) {
                if (V2.w[i] <= 0)
                    V.dw[i] = 0; // threshold
                else
                    V.dw[i] += V2.dw[i];
            }
        };
        return ReluLayer;
    }(Net.BaseLayer));
    Net.ReluLayer = ReluLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    // Implements Sigmoid nnonlinearity elementwise
    // x -> 1/(1+e^(-x))
    // so the output is between 0 and 1.
    var SigmoidLayer = (function (_super) {
        __extends(SigmoidLayer, _super);
        function SigmoidLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'sigmoid';
            this.updateDimensions(opt.pred);
        }
        SigmoidLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var V2 = V.cloneAndZero();
            var N = V.w.length;
            var V2w = V2.w;
            var Vw = V.w;
            for (var i = 0; i < N; i++) {
                V2w[i] = 1.0 / (1.0 + Math.exp(-Vw[i]));
            }
            this.out_act = V2;
            return this.out_act;
        };
        SigmoidLayer.prototype.backward = function () {
            var V = this.in_act; // we need to set dw of this
            var V2 = this.out_act;
            var N = V.w.length;
            for (var i = 0; i < N; i++) {
                var v2wi = V2.w[i];
                V.dw[i] += v2wi * (1.0 - v2wi) * V2.dw[i];
            }
        };
        return SigmoidLayer;
    }(Net.BaseLayer));
    Net.SigmoidLayer = SigmoidLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    // implements an L2 regression cost layer,
    // so penalizes \sum_i(||x_i - y_i||^2), where x is its input
    // and y is the user-provided array of "correct" values.
    var RegressionLayer = (function (_super) {
        __extends(RegressionLayer, _super);
        function RegressionLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'regression';
            this.updateDimensions(opt.pred);
        }
        RegressionLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            this.out_act = V;
            return V; // identity function
        };
        // y is a list here of size num_inputs
        // or it can be a number if only one value is regressed
        // or it can be a struct {dim: i, val: x} where we only want to 
        // regress on dimension i and asking it to have value x
        RegressionLayer.prototype.backward = function (y) {
            // compute and accumulate gradient wrt weights and bias of this layer
            var x = this.in_act;
            var loss = 0.0;
            if (y instanceof Float32Array) {
                for (var i = 0; i < this.out_depth; i++) {
                    var dy = x.w[i] - y[i];
                    x.dw[i] = dy;
                    loss += 0.5 * dy * dy;
                }
            }
            else if (typeof y === 'number') {
                // lets hope that only one number is being regressed
                var dy = x.w[0] - y;
                x.dw[0] = dy;
                loss += 0.5 * dy * dy;
            }
            else {
                // assume it is a struct with entries .dim and .val
                // and we pass gradient only along dimension dim to be equal to val
                var i = y.dim;
                var yi = y.val;
                var dy = x.w[i] - yi;
                x.dw[i] = dy;
                loss += 0.5 * dy * dy;
            }
            return loss;
        };
        RegressionLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
            this.out_depth = this.num_inputs;
        };
        RegressionLayer.prototype.getOutputShape = function () {
            return [this.out_depth, 1, 1];
        };
        RegressionLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.num_inputs = this.num_inputs;
            return json;
        };
        RegressionLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.num_inputs = json.num_inputs;
        };
        return RegressionLayer;
    }(Net.BaseLayer));
    Net.RegressionLayer = RegressionLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
    // This is a classifier, with N discrete classes from 0 to N-1
    // it gets a stream of N incoming numbers and computes the softmax
    // function (exponentiate and normalize to sum to 1 as probabilities should)
    var SoftmaxLayer = (function (_super) {
        __extends(SoftmaxLayer, _super);
        function SoftmaxLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'softmax';
            this.updateDimensions(opt.pred);
        }
        SoftmaxLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var A = new Net.Vol(1, 1, this.out_depth, 0.0);
            // compute max activation
            var as = V.w;
            var amax = V.w[0];
            for (var i = 1; i < this.out_depth; i++) {
                if (as[i] > amax)
                    amax = as[i];
            }
            // compute exponentials (carefully to not blow up)
            var es = nj.zeros(this.out_depth);
            var esum = 0.0;
            for (var i = 0; i < this.out_depth; i++) {
                var e = Math.exp(as[i] - amax);
                esum += e;
                es[i] = e;
            }
            // normalize and output to sum to one
            for (var i = 0; i < this.out_depth; i++) {
                es[i] /= esum;
                A.w[i] = es[i];
            }
            this.es = es; // save these for backprop
            this.out_act = A;
            return this.out_act;
        };
        SoftmaxLayer.prototype.backward = function (y) {
            // compute and accumulate gradient wrt weights and bias of this layer
            var x = this.in_act;
            for (var i = 0; i < this.out_depth; i++) {
                var indicator = i === y ? 1.0 : 0.0;
                var mul = -(indicator - this.es[i]);
                x.dw[i] += mul;
            }
            // loss is the class negative log likelihood
            return -Math.log(this.es[y]);
        };
        SoftmaxLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
            this.out_depth = this.num_inputs;
        };
        SoftmaxLayer.prototype.getOutputShape = function () {
            return [this.out_depth, 1, 1];
        };
        SoftmaxLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.num_inputs = this.num_inputs;
            return json;
        };
        SoftmaxLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.num_inputs = json.num_inputs;
        };
        return SoftmaxLayer;
    }(Net.BaseLayer));
    Net.SoftmaxLayer = SoftmaxLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    // implements an L2 regression cost layer,
    // so penalizes \sum_i(||x_i - y_i||^2), where x is its input
    // and y is the user-provided array of "correct" values.
    var SVMLayer = (function (_super) {
        __extends(SVMLayer, _super);
        function SVMLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'svm';
            this.updateDimensions(opt.pred);
        }
        SVMLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            this.out_act = V;
            return V; // identity function
        };
        SVMLayer.prototype.backward = function (y) {
            // compute and accumulate gradient wrt weights and bias of this layer
            var x = this.in_act;
            // we're using structured loss here, which means that the score
            // of the ground truth should be higher than the score of any other 
            // class, by a margin
            var yscore = x.w[y]; // score of ground truth
            var margin = 1.0;
            var loss = 0.0;
            for (var i = 0; i < this.out_depth; i++) {
                if (y === i) {
                    continue;
                }
                var ydiff = -yscore + x.w[i] + margin;
                if (ydiff > 0) {
                    // violating dimension, apply loss
                    x.dw[i] += 1;
                    x.dw[y] -= 1;
                    loss += ydiff;
                }
            }
            return loss;
        };
        SVMLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred[0].out_sx;
                this.in_sy = pred[0].out_sy;
                this.in_depth = pred[0].out_depth;
            }
            this.num_inputs = this.in_sx * this.in_sy * this.in_depth;
            this.out_depth = this.num_inputs;
        };
        SVMLayer.prototype.getOutputShape = function () {
            return [this.out_depth, 1, 1];
        };
        SVMLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.num_inputs = this.num_inputs;
            return json;
        };
        SVMLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.num_inputs = json.num_inputs;
        };
        return SVMLayer;
    }(Net.BaseLayer));
    Net.SVMLayer = SVMLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    // a bit experimental layer for now. I think it works but I'm not 100%
    // the gradient check is a bit funky. I'll look into this a bit later.
    // Local Response Normalization in window, along depths of volumes
    var LocalResponseNormalizationLayer = (function (_super) {
        __extends(LocalResponseNormalizationLayer, _super);
        function LocalResponseNormalizationLayer(opt) {
            _super.call(this, opt || {});
            this.layer_type = 'lrn';
            // required
            this.k = opt.k;
            this.n = opt.n;
            this.alpha = opt.alpha;
            this.beta = opt.beta;
            // checks
            if (this.n % 2 === 0) {
                console.warn('WARNING n should be odd for LRN layer');
            }
            this.updateDimensions(opt.pred);
        }
        LocalResponseNormalizationLayer.prototype.forward = function (V, is_training) {
            this.in_act = V;
            this.resetGradient();
            var A = V.cloneAndZero();
            this.S_cache_ = V.cloneAndZero();
            var n2 = Math.floor(this.n / 2);
            for (var x = 0; x < V.sx; x++) {
                for (var y = 0; y < V.sy; y++) {
                    for (var i = 0; i < V.depth; i++) {
                        var a_i = V.get(x, y, i);
                        var f0 = this.k;
                        var f1 = this.alpha / this.n;
                        var sum = 0.0;
                        // normalize in a window of size n
                        for (var j = Math.max(0, i - n2); j <= Math.min(i + n2, V.depth - 1); j++) {
                            var aa = V.get(x, y, j);
                            sum += aa * aa;
                        }
                        // will be useful for backprop
                        var scale_i = f0 + f1 * sum;
                        this.S_cache_.set(x, y, i, scale_i);
                        var b_i = a_i * Math.pow(scale_i, -this.beta);
                        A.set(x, y, i, b_i);
                    }
                }
            }
            this.out_act = A;
            return this.out_act; // dummy identity function for now
        };
        LocalResponseNormalizationLayer.prototype.backward = function () {
            // evaluate gradient wrt data
            var V = this.in_act; // we need to set dw of this
            var A = this.out_act; // computed in forward pass 
            var n2 = Math.floor(this.n / 2);
            for (var x = 0; x < V.sx; x++) {
                for (var y = 0; y < V.sy; y++) {
                    for (var i = 0; i < V.depth; i++) {
                        var scale_i = this.S_cache_.get(x, y, i);
                        var a_i = V.get(x, y, i);
                        var be_i = A.get_grad(x, y, i);
                        var f0 = Math.pow(scale_i, -this.beta) * be_i;
                        var f1 = 2.0 * this.alpha * this.beta / this.n * a_i;
                        var sum = 0.0;
                        // normalize in a window of size n
                        for (var j = Math.max(0, i - n2); j <= Math.min(i + n2, V.depth - 1); j++) {
                            var b_j = A.get(x, y, j);
                            var be_j = A.get_grad(x, y, j);
                            var scale_j = this.S_cache_.get(x, y, j);
                            sum += be_j * b_j / scale_j;
                        }
                        var ae_i = f0 - f1 * sum;
                        V.add_grad(x, y, i, ae_i);
                    }
                }
            }
        };
        LocalResponseNormalizationLayer.prototype.getDescription = function () {
            return _super.prototype.getDescription.call(this).concat([
                'n ' + this.n + ', ' + 'k ' + this.k,
            ]);
        };
        LocalResponseNormalizationLayer.prototype.toJSON = function () {
            var json = _super.prototype.toJSON.call(this);
            json.k = this.k;
            json.n = this.n;
            json.alpha = this.alpha; // normalize by size
            json.beta = this.beta;
            return json;
        };
        LocalResponseNormalizationLayer.prototype.fromJSON = function (json) {
            _super.prototype.fromJSON.call(this, json);
            this.k = json.k;
            this.n = json.n;
            this.alpha = json.alpha; // normalize by size
            this.beta = json.beta;
        };
        return LocalResponseNormalizationLayer;
    }(Net.BaseLayer));
    Net.LocalResponseNormalizationLayer = LocalResponseNormalizationLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
/// <reference path="InputLayer.ts" />
/// <reference path="ConcatLayer.ts" />
/// <reference path="ConvLayer.ts" />
/// <reference path="PoolLayer.ts" />
/// <reference path="FullyConnectedLayer.ts" />
/// <reference path="DropoutLayer.ts" />
/// <reference path="TanhLayer.ts" />
/// <reference path="MaxoutLayer.ts" />
/// <reference path="ReluLayer.ts" />
/// <reference path="SigmoidLayer.ts" />
/// <reference path="RegressionLayer.ts" />
/// <reference path="SoftmaxLayer.ts" />
/// <reference path="SVMLayer.ts" />
/// <reference path="LocalResponseNormalizationLayer.ts" /> 
/// <reference path="../../Parser/index.ts" />
/// <reference path="Layers/_index.ts" />
var Net;
(function (Net) {
    var CaffeModel = (function (_super) {
        __extends(CaffeModel, _super);
        function CaffeModel(modelPath, weightPath) {
            _super.call(this);
            this.modelPath = modelPath;
            this.weightPath = weightPath;
        }
        CaffeModel.prototype.load = function () {
            var _this = this;
            return this.fetch(this.modelPath)
                .then(function (model) { return _this.create(model); })
                .then(function (model) { return _this.loadWeights(); });
        };
        CaffeModel.prototype.fetch = function (url) {
            var protoParser = new Parser.PrototxtParser();
            return protoParser.parse(url);
        };
        CaffeModel.prototype.create = function (model) {
            this.name = model.name;
            this.createLayers(model, model.layer || model.layers, model.input === 'data');
            this.createEdges();
        };
        CaffeModel.prototype.caffeLayerToJs = function (layerOpt) {
            var _this = this;
            var layer;
            var opt = { name: layerOpt.name, input: layerOpt.bottom, output: layerOpt.top };
            // Get predecessors of the current layers
            if (layerOpt.bottom !== undefined) {
                if (!Array.isArray(layerOpt.bottom)) {
                    opt.pred = [this.layers.get(layerOpt.bottom)];
                }
                else {
                    opt.pred = layerOpt.bottom.map(function (d) { return _this.layers.get(d); });
                }
            }
            switch (layerOpt.type.toLowerCase()) {
                case 'input':
                    var p = layerOpt.input_param || {};
                    opt.out_depth = +p.shape.dim[1];
                    opt.out_sx = +p.shape.dim[2];
                    opt.out_sy = +p.shape.dim[3];
                    layer = new Net.InputLayer(opt);
                    break;
                case 'conv':
                case 'convolution':
                    var p = layerOpt.param || {};
                    var cp = layerOpt.convolution_param || {};
                    opt.sx = cp.kernel_size !== undefined ? +cp.kernel_size : undefined;
                    opt.filters = cp.num_output !== undefined ? +cp.num_output : undefined;
                    opt.pad = cp.pad !== undefined ? +cp.pad : undefined;
                    opt.stride = cp.stride !== undefined ? +cp.stride : undefined;
                    opt.l1_decay_mul = p && p.length && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0;
                    opt.l2_decay_mul = p && p.length && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0;
                    layer = new Net.ConvLayer(opt);
                    break;
                case 'lrn':
                    var p = layerOpt.lrn_param || {};
                    opt.k = p.k !== undefined ? +p.k : 1;
                    opt.n = p.local_size !== undefined ? +p.local_size : undefined;
                    opt.alpha = p.alpha !== undefined ? +p.alpha : undefined;
                    opt.beta = p.beta !== undefined ? +p.beta : undefined;
                    layer = new Net.LocalResponseNormalizationLayer(opt);
                    break;
                case 'dropout':
                    var dp = layerOpt.dropout_param || {};
                    opt.drop_prob = dp.dropout_ratio !== undefined ? +dp.dropout_ratio : undefined;
                    layer = new Net.DropoutLayer(opt);
                    break;
                case 'concat':
                    var cp = layerOpt.concat_param || {};
                    opt.axis = cp.axis !== undefined ? +cp.axis : undefined;
                    layer = new Net.ConcatLayer(opt);
                    break;
                case 'pool':
                case 'pooling':
                    var pp = layerOpt.pooling_param || {};
                    opt.pool = pp.pool !== undefined ? pp.pool : undefined;
                    opt.sx = pp.kernel_size !== undefined ? +pp.kernel_size : undefined;
                    opt.pad = pp.pad !== undefined ? +pp.pad : undefined;
                    opt.stride = pp.stride !== undefined ? +pp.stride : undefined;
                    layer = new Net.PoolLayer(opt);
                    break;
                case 'inner_product':
                case 'innerproduct':
                    var pp = layerOpt.inner_product_param || {};
                    var p = layerOpt.param || {};
                    opt.num_neurons = pp.num_output !== undefined ? +pp.num_output : undefined;
                    opt.l1_decay_mul = p && p.length && p[0].decay_mult !== undefined ? +p[0].decay_mult : 0.0;
                    opt.l2_decay_mul = p && p.length && p[1].decay_mult !== undefined ? +p[1].decay_mult : 1.0;
                    layer = new Net.FullyConnectedLayer(opt);
                    break;
                case 'softmax':
                    layer = new Net.SoftmaxLayer(opt);
                    break;
                case 'relu':
                    layer = new Net.ReluLayer(opt);
                    break;
                case 'sigmoid':
                    layer = new Net.SigmoidLayer(opt);
                    break;
                case 'tanh':
                    layer = new Net.TanhLayer(opt);
                    break;
                default:
                    console.error('Cannot parse layer ' + layerOpt.type, layerOpt);
                    return;
            }
            this.layers.set(layer.name, layer);
        };
        CaffeModel.prototype.createLayers = function (model, layers, makeInput) {
            var _this = this;
            if (makeInput === void 0) { makeInput = false; }
            this.layers = d3.map();
            // Create Input layer manually
            if (makeInput) {
                this.layers.set('data', new Net.InputLayer({
                    name: 'data',
                    in_depth: +model.input_dim[1],
                    in_sy: +model.input_dim[2],
                    in_sx: +model.input_dim[3],
                }));
            }
            // Create all other layers
            layers.forEach(function (d) { return _this.caffeLayerToJs(d); });
        };
        CaffeModel.prototype.createEdges = function () {
            var _this = this;
            this.edges = [];
            this.layers.values()
                .filter(function (d) { return d.input !== undefined && d.input !== d.output; })
                .forEach(function (d) {
                if (!Array.isArray(d.input)) {
                    _this.edges.push({ from: d.input, to: d.output });
                }
                else {
                    d.input.forEach(function (layerName) {
                        _this.edges.push({ from: layerName, to: d.output });
                    });
                }
            });
            // Parse self-loops in Caffe
            // (usually for ReLU layers due to performance reasons)
            // To make this library more efficient,
            // we should allow and implement these self loops
            this.layers.values()
                .filter(function (d) { return d.input !== undefined && d.input === d.output; })
                .forEach(function (d) {
                _this.edges
                    .filter(function (edge) { return edge.from === d.input; })
                    .forEach(function (edge) {
                    edge.from = d.name;
                    _this.edges.push({ from: d.input, to: d.name });
                });
            });
        };
        CaffeModel.prototype.loadWeights = function () {
            var _this = this;
            if (!this.weightPath) {
                return Promise.resolve();
            }
            // Load all separate weights for the layers
            return Promise.all(this.layers.values()
                .filter(function (d) { return d.layer_type == 'conv' || d.layer_type == 'fc'; })
                .map(function (layer) {
                return Promise.all([
                    fetch(_this.weightPath + layer.name + '_filter.bin')
                        .then(function (response) { return response.arrayBuffer(); })
                        .then(function (arrayBuffer) {
                        var f = new Float32Array(arrayBuffer);
                        var n = layer.sx * layer.sy * layer.in_depth;
                        // if (layer.layer_type != 'fc'){
                        for (var i = 0; i < layer.out_depth; i++) {
                            layer.filters[i].w.set(f.slice(i * n, i * n + n));
                        }
                        // }
                        // // Hack: this should be done in convert_caffemodel
                        // // but it is tricky there
                        // else {
                        //   var sx = layer.in_sx;
                        //   var sy = layer.in_sy;
                        //   var depth = layer.in_depth;
                        //   for(let i=0; i<layer.out_depth; i++) {
                        //     let fi = layer.filters[i];
                        //     let A = f.slice(i*n, i*n+n);
                        //     for (let x=0; x<sx; x++) {
                        //       for (let y=0; y<sy; y++) {
                        //         for (let d=0; d<depth; d++) {
                        //           let ix = ((sx * y) + x) * depth + d;
                        //           fi.set(x, y, d, A[ix]);
                        //         }
                        //       }
                        //     }
                        // }
                        // }
                    }),
                    fetch(_this.weightPath + layer.name + '_bias.bin')
                        .then(function (response) { return response.arrayBuffer(); })
                        .then(function (arrayBuffer) {
                        var f = new Float32Array(arrayBuffer);
                        layer.biases.w.set(f);
                    })
                ]);
            }));
        };
        return CaffeModel;
    }(Net.Net));
    Net.CaffeModel = CaffeModel;
})(Net || (Net = {}));
/// <reference path="Vol.ts" />
/// <reference path="ILayer.ts" />
/// <reference path="Net.ts" />
/// <reference path="CaffeModel.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Layers/_index.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="../../Net/index.ts" />
var ImgJS;
(function (ImgJS) {
    var nj = NumJS;
    var Image = (function () {
        function Image(src) {
            this.src = src;
            this.canvas = document.createElement('canvas');
            this.image = document.createElement('img');
        }
        Image.prototype.set = function (imgData) {
            this.data = imgData.data;
            this.image.width = imgData.width;
            this.image.height = imgData.height;
            return this;
        };
        Image.prototype.load = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var ctx = _this.canvas.getContext('2d');
                _this.image.onload = function () {
                    ctx.imageSmoothingEnabled = false;
                    _this.canvas.width = _this.image.width;
                    _this.canvas.height = _this.image.height;
                    ctx.drawImage(_this.image, 0, 0);
                    var imgData = ctx.getImageData(0, 0, _this.image.width, _this.image.height);
                    _this.data = imgData.data;
                    resolve(_this.data);
                };
                _this.image.src = _this.src;
            });
        };
        Image.prototype.render = function (canvas) {
            if (canvas === undefined) {
                canvas = this.canvas;
                document.body.appendChild(canvas);
            }
            canvas.width = this.image.width;
            canvas.height = this.image.height;
            var ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            var img = ctx.getImageData(0, 0, this.image.width, this.image.height);
            img.data.set(this.data);
            ctx.putImageData(img, 0, 0);
        };
        Image.fromMean = function (vol, depth, scale, normalize) {
            if (depth === void 0) { depth = 0; }
            if (scale === void 0) { scale = 1; }
            if (normalize === void 0) { normalize = false; }
            return Image.fromVol(vol, 0, [0, 1, 2], scale, normalize);
        };
        Image.fromFilter = function (vol, depth, scale, normalize) {
            if (depth === void 0) { depth = 0; }
            if (scale === void 0) { scale = 1; }
            if (normalize === void 0) { normalize = true; }
            return Image.fromVol(vol, 0, depth, scale, normalize);
        };
        // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
        // hence we need to also convert them back to RGB
        Image.fromVol = function (vol, mean, channel, scale, normalize, aplha) {
            if (channel === void 0) { channel = [2, 1, 0]; }
            if (scale === void 0) { scale = 1; }
            if (normalize === void 0) { normalize = false; }
            if (aplha === void 0) { aplha = 255; }
            var img = new Image();
            mean = mean !== undefined ? mean : [0, 0, 0];
            var w = vol.sx;
            var h = vol.sy;
            var n = w * h * 4;
            var mm = nj.maxmin(vol.w);
            var c0 = channel ? channel instanceof Array ? channel[0] : +channel : 0;
            var c1 = channel ? channel instanceof Array ? channel[1] : +channel : 0;
            var c2 = channel ? channel instanceof Array ? channel[2] : +channel : 0;
            var data = new Uint8ClampedArray(n);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pp = (y * w + x) * 4;
                    var mean_0 = mean ? mean instanceof Net.Vol ? mean.get(x, y, c0) : +mean[c0] : 0;
                    var mean_1 = mean ? mean instanceof Net.Vol ? mean.get(x, y, c1) : +mean[c1] : 0;
                    var mean_2 = mean ? mean instanceof Net.Vol ? mean.get(x, y, c2) : +mean[c2] : 0;
                    var dval_0 = vol.get(x, y, c0);
                    var dval_1 = vol.get(x, y, c1);
                    var dval_2 = vol.get(x, y, c2);
                    if (normalize) {
                        dval_0 = Math.floor((vol.get(x, y, c0) - mm.minv) / mm.dv * 255);
                        dval_1 = Math.floor((vol.get(x, y, c1) - mm.minv) / mm.dv * 255);
                        dval_2 = Math.floor((vol.get(x, y, c2) - mm.minv) / mm.dv * 255);
                    }
                    data[pp + 0] = dval_0 + mean_0;
                    data[pp + 1] = dval_1 + mean_1;
                    data[pp + 2] = dval_2 + mean_2;
                    data[pp + 3] = aplha;
                }
            }
            img.image.width = w;
            img.image.height = h;
            img.data = data;
            return img;
        };
        // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
        // hence we need to also convert to BGR order
        // Also mean should be provided in this format
        Image.prototype.toVol = function (mean, channel) {
            if (channel === void 0) { channel = [2, 1, 0]; }
            mean = mean !== undefined ? mean : [0, 0, 0];
            var w = this.image.width;
            var h = this.image.height;
            var c0 = channel[0];
            var c1 = channel[1];
            var c2 = channel[2];
            var vol = new Net.Vol(w, h, 3, 0.0);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pp = (y * w + x) * 4;
                    var mean_0 = mean instanceof Net.Vol ? mean.get(x, y, c0) : +mean[c0];
                    var mean_1 = mean instanceof Net.Vol ? mean.get(x, y, c1) : +mean[c1];
                    var mean_2 = mean instanceof Net.Vol ? mean.get(x, y, c2) : +mean[c2];
                    vol.set(x, y, c0, this.data[pp + 0] - mean_0);
                    vol.set(x, y, c1, this.data[pp + 1] - mean_1);
                    vol.set(x, y, c2, this.data[pp + 2] - mean_2);
                }
            }
            return vol;
        };
        return Image;
    }());
    ImgJS.Image = Image;
})(ImgJS || (ImgJS = {}));
/// <reference path="Image.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="../../Net/index.ts" />
var Utils;
(function (Utils) {
    var GraphDrawer = (function (_super) {
        __extends(GraphDrawer, _super);
        function GraphDrawer() {
            _super.call(this);
        }
        GraphDrawer.prototype.render = function (element, width, height) {
            // Create the renderer
            var render = new dagreD3.render();
            this.graph = this.createGraph();
            // Clean
            this.$elem = d3.select(element);
            this.$elem.selectAll('*').remove();
            // Run the renderer. This is what draws the final graph.
            this.$svg = this.$elem.append('svg');
            this.$g = this.$svg.append("g");
            render(this.$g, this.graph);
            this.width = width || this.graph.graph().width;
            this.height = height || this.graph.graph().height;
            // Center the graph
            var xOffset = (this.width - this.graph.graph().width) / 2;
            this.$g.attr("transform", "translate(" + xOffset + ")");
            this.$svg.attr('width', this.width);
            this.$svg.attr('height', this.height);
            return this;
        };
        GraphDrawer.prototype.fit = function () {
            // this.$g.attr("transform", "translate(" + 0 + ")");
            this.$svg.attr("viewBox", "0 0 " + this.graph.graph().width + " " + this.graph.graph().height);
            // this.$svg.attr("preserveAspectRatio", "xMinYMax meet");
            return this;
        };
        GraphDrawer.prototype.rotate = function () {
            var xOffset = (this.width - this.graph.graph().width) / 2;
            this.$g.attr("transform", "rotate(270) translate(" + xOffset + ")");
            this.$svg.attr("viewBox", "0 0 " + this.graph.graph().height + " " + this.graph.graph().width);
            return this;
        };
        GraphDrawer.prototype.createGraph = function () {
            var _this = this;
            // Create the input graph
            var g = new dagreD3.graphlib.Graph()
                .setGraph({})
                .setDefaultEdgeLabel(function () { return {}; });
            this.layerIterator(function (layer, i, pred) {
                // var numParamsPerLayer = nj.sum(layer.getNumParameters());
                g.setNode(layer.name, {
                    labelType: "html",
                    label: layer.getDescription().join('<br>'),
                    class: "layer-" + layer.layer_type
                });
            });
            g.nodes().forEach(function (v) {
                var node = g.node(v);
                // Round the corners of the nodes
                node.rx = node.ry = 5;
            });
            this.edges
                .filter(function (edge) { return edge.from !== undefined && edge.to !== undefined; })
                .forEach(function (edge) {
                g.setEdge(edge.from, edge.to, {
                    label: _this.layers.get(edge.from).getOutputShape().join('x')
                });
            });
            return g;
        };
        GraphDrawer.fromNet = function (model) {
            var g = new GraphDrawer;
            g.layers = model.layers;
            g.edges = model.edges;
            return g;
        };
        return GraphDrawer;
    }(Net.Net));
    Utils.GraphDrawer = GraphDrawer;
})(Utils || (Utils = {}));
/// <reference path="../../Net/index.ts" />
/// <reference path="../../ImgJS/index.ts" />
var Utils;
(function (Utils) {
    var ActivationDrawer = (function (_super) {
        __extends(ActivationDrawer, _super);
        function ActivationDrawer() {
            _super.call(this);
        }
        ActivationDrawer.prototype.render = function (element, renderInput, maxElementsPerLayer, width, height) {
            if (renderInput === void 0) { renderInput = true; }
            // Clean
            var $elem = d3.select(element);
            $elem.selectAll('*').remove();
            this.layerIterator(function (layer, j) {
                if (!renderInput && j == 0) {
                    return;
                }
                $elem.append('h5').text(layer.name);
                var $div = $elem.append('div')
                    .attr('class', 'net-layer');
                var $vis = $div.append('div')
                    .attr('class', 'net-vis');
                var $weights = $vis.append('div')
                    .attr('class', 'net-weights');
                var $activations = $vis.append('div')
                    .attr('class', 'net-activations');
                for (var i = 0, len = layer.out_act.depth; i < len; ++i) {
                    if (maxElementsPerLayer && i >= maxElementsPerLayer) {
                        return;
                    }
                    var $canv = $activations.append('canvas');
                    var A = layer.out_act;
                    // if (width && height){
                    //   A = A.zoom(width / A.sx, height / A.sy);
                    // }
                    ImgJS.Image.fromFilter(A, i, 1).render($canv[0][0]);
                }
            });
        };
        ActivationDrawer.fromNet = function (model) {
            var g = new ActivationDrawer;
            g.layers = model.layers;
            g.edges = model.edges;
            return g;
        };
        return ActivationDrawer;
    }(Net.Net));
    Utils.ActivationDrawer = ActivationDrawer;
})(Utils || (Utils = {}));
/// <reference path="GraphDrawer.ts" />
/// <reference path="ActivationDrawer.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="NumJS/index.ts" />
/// <reference path="ImgJS/index.ts" />
/// <reference path="Parser/index.ts" />
/// <reference path="Net/index.ts" />
/// <reference path="Utils/index.ts" /> 
