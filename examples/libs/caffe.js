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
            this.dw = nj.zeros(n);
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
    var BaseParser = (function () {
        function BaseParser() {
        }
        BaseParser.prototype.fetch = function (url) {
            var req = new Request(url);
            return fetch(req).then(function (response) { return response.text(); });
        };
        BaseParser.prototype.parse = function (url) {
            var _this = this;
            return this.fetch(url).then(function (response) { return _this.parseString(response); });
        };
        return BaseParser;
    }());
    Parser.BaseParser = BaseParser;
})(Parser || (Parser = {}));
/// <reference path="BaseParser.ts" />
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
    }(Parser.BaseParser));
    Parser.PrototxtParser = PrototxtParser;
})(Parser || (Parser = {}));
/// <reference path="BaseParser.ts" />
/// <reference path="PrototxtParser.ts" /> 
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
            this.out_sx = Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
            this.out_sy = Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
        };
        ConvLayer.prototype.getNumParameters = function () {
            return [this.in_depth * this.sx * this.sy * this.out_depth, this.out_depth];
        };
        ConvLayer.prototype.getOutputShape = function () {
            return [
                this.out_depth,
                Math.ceil((this.in_sy + 2 * this.pad - this.sy + 1 + this.stride - 1) / this.stride),
                Math.ceil((this.in_sx + 2 * this.pad - this.sx + 1 + this.stride - 1) / this.stride),
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
                            var xend = Math.min(xstart + this.sx, this.out_sx + this.pad);
                            var yend = Math.min(ystart + this.sy, this.out_sy + this.pad);
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
            this.out_sx = Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
            this.out_sy = Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
            this.out_depth = this.in_depth;
        };
        PoolLayer.prototype.getOutputShape = function () {
            return [
                this.out_depth,
                Math.ceil((this.in_sy + 2 * this.pad - this.sy + 1 + this.stride - 1) / this.stride),
                Math.ceil((this.in_sx + 2 * this.pad - this.sx + 1 + this.stride - 1) / this.stride),
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
                }
            }
            else {
                // scale the activations during prediction
                for (var i = 0; i < N; i++) {
                    V2.w[i] *= this.drop_prob;
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
                'alpha ' + this.alpha,
                'beta ' + this.beta,
                'k ' + this.k,
                'n ' + this.n,
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
                        for (var i = 0; i < layer.out_depth; i++) {
                            layer.filters[i].w.set(f.slice(i * n, i * n + n));
                        }
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
                    var mean_0 = mean ? mean[c0] instanceof Array ? +mean[c0][y * h + x] : +mean[c0] : 0;
                    var mean_1 = mean ? mean[c1] instanceof Array ? +mean[c1][y * h + x] : +mean[c1] : 0;
                    var mean_2 = mean ? mean[c2] instanceof Array ? +mean[c2][y * h + x] : +mean[c2] : 0;
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
                    var mean_0 = mean[c0] instanceof Array ? +mean[c0][y * h + x] : +mean[c0];
                    var mean_1 = mean[c1] instanceof Array ? +mean[c1][y * h + x] : +mean[c1];
                    var mean_2 = mean[c2] instanceof Array ? +mean[c2][y * h + x] : +mean[c2];
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
        GraphDrawer.prototype.render = function (element, width) {
            if (width === void 0) { width = 600; }
            // Create the renderer
            var render = new dagreD3.render();
            var graph = this.createGraph();
            // Clean
            var $elem = d3.select(element);
            $elem.selectAll('*').remove();
            // Run the renderer. This is what draws the final graph.
            var $svg = $elem.append('svg')
                .attr('width', width);
            var $g = $svg.append("g");
            render($g, graph);
            // Center the graph
            var xCenterOffset = (width - graph.graph().width) / 2;
            $g.attr("transform", "translate(" + xCenterOffset + ", 20)");
            $svg.attr("height", graph.graph().height + 40);
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
    var jil = ImgJS;
    var FilterDrawer = (function (_super) {
        __extends(FilterDrawer, _super);
        function FilterDrawer() {
            _super.call(this);
        }
        FilterDrawer.prototype.render = function (element) {
            // Clean
            var $elem = d3.select(element);
            $elem.selectAll('*').remove();
            this.layerIterator(function (layer) {
                $elem.append('h3')
                    .text("Layer type: " + layer.name);
                var $div = $elem.append('div')
                    .attr('class', 'net-layer');
                var $info = $div.append('div')
                    .attr('class', 'net-description');
                var $vis = $div.append('div')
                    .attr('class', 'net-vis');
                var $weights = $vis.append('div')
                    .attr('class', 'net-weights');
                var $activations = $vis.append('div')
                    .attr('class', 'net-activations');
                $info.append('span')
                    .text(layer.layer_type);
                for (var i = 0, len = layer.out_act.depth; i < len; ++i) {
                    var $canv = $activations.append('canvas');
                    jil.Image.fromFilter(layer.out_act, i, 1).render($canv[0][0]);
                }
            });
        };
        FilterDrawer.fromNet = function (model) {
            var g = new FilterDrawer;
            g.layers = model.layers;
            g.edges = model.edges;
            return g;
        };
        return FilterDrawer;
    }(Net.Net));
    Utils.FilterDrawer = FilterDrawer;
})(Utils || (Utils = {}));
/// <reference path="GraphDrawer.ts" />
/// <reference path="FilterDrawer.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="NumJS/index.ts" />
/// <reference path="ImgJS/index.ts" />
/// <reference path="Parser/index.ts" />
/// <reference path="Net/index.ts" />
/// <reference path="Utils/index.ts" /> 
