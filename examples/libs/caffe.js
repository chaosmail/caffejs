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
            throw "Bad input shape";
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
            throw "Bad input shape";
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
            throw "Bad input shape";
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
            throw "Bad input shape";
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
            throw "Bad input shape";
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
        return A.sort(function (a, b) {
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
            }
            this.out_sx = this.in_sx;
            this.out_sy = this.in_sy;
            this.out_depth = this.in_depth;
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
                for (var j = 0; j < Vs.length; j++) {
                    var V = Vs[j];
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
                for (var j = 0, len = Vs.length; j < len; ++j) {
                    var Vdw = Vs[j].dw;
                    V2dw.set(Vdw, offset);
                    offset += Vdw.length;
                }
            }
            else {
                for (var j = 0, len = Vs.length; j < len; ++j) {
                    var V = Vs[j];
                    for (var d = 0, depth = V.depth; d < depth; ++d)
                        for (var x = 0, sx = V.sx; x < sx; ++x) {
                            for (var y = 0, sy = V.sy; y < sy; ++y) {
                                V.set_grad(x, y, d, V2.get_grad(x, y, d + offset));
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
        ConvLayer.prototype.forward = function (V, is_training) {
            // optimized code by @mdda that achieves 2x speedup over previous version
            this.in_act = V;
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
            V.dw = nj.zeros(V.w.length); // zero out gradient wrt bottom data, we're about to fill it
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
            V.dw = nj.zeros(V.w.length); // zero out gradient wrt data
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
            }
            this.out_sx = Math.round((this.in_sx + this.pad * 2 - this.sx) / this.stride + 1);
            this.out_sy = Math.round((this.in_sy + this.pad * 2 - this.sy) / this.stride + 1);
            this.out_depth = this.in_depth;
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
            V.dw = nj.zeros(V.w.length); // zero out the gradient in input Vol
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
            V.dw = nj.zeros(N); // zero out gradient wrt data
            for (var i = 0; i < N; i++) {
                if (this.dropped[i] !== 1) {
                    V.dw[i] = chain_grad.dw[i]; // copy over the gradient
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
            V.dw = nj.zeros(N); // zero out gradient wrt data
            for (var i = 0; i < N; i++) {
                var v2wi = V2.w[i];
                V.dw[i] = (1.0 - v2wi * v2wi) * V2.dw[i];
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
            V.dw = nj.zeros(V.w.length); // zero out gradient wrt data
            // pass the gradient through the appropriate switch
            if (this.out_sx === 1 && this.out_sy === 1) {
                for (var i = 0; i < N; i++) {
                    var chain_grad = V2.dw[i];
                    V.dw[this.switches[i]] = chain_grad;
                }
            }
            else {
                // bleh okay, lets do this the hard way
                var n = 0; // counter for switches
                for (var x = 0; x < V2.sx; x++) {
                    for (var y = 0; y < V2.sy; y++) {
                        for (var i = 0; i < N; i++) {
                            var chain_grad = V2.get_grad(x, y, i);
                            V.set_grad(x, y, this.switches[n], chain_grad);
                            n++;
                        }
                    }
                }
            }
        };
        MaxoutLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
    var nj = NumJS;
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
            V.dw = nj.zeros(N); // zero out gradient wrt data
            for (var i = 0; i < N; i++) {
                if (V2.w[i] <= 0)
                    V.dw[i] = 0; // threshold
                else
                    V.dw[i] = V2.dw[i];
            }
        };
        return ReluLayer;
    }(Net.BaseLayer));
    Net.ReluLayer = ReluLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
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
            V.dw = nj.zeros(N); // zero out gradient wrt data
            for (var i = 0; i < N; i++) {
                var v2wi = V2.w[i];
                V.dw[i] = v2wi * (1.0 - v2wi) * V2.dw[i];
            }
        };
        return SigmoidLayer;
    }(Net.BaseLayer));
    Net.SigmoidLayer = SigmoidLayer;
})(Net || (Net = {}));
/// <reference path="BaseLayer.ts" />
var Net;
(function (Net) {
    var nj = NumJS;
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
            x.dw = nj.zeros(x.w.length); // zero out the gradient of input Vol
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
            x.dw = nj.zeros(x.w.length); // zero out the gradient of input Vol
            for (var i = 0; i < this.out_depth; i++) {
                var indicator = i === y ? 1.0 : 0.0;
                var mul = -(indicator - this.es[i]);
                x.dw[i] = mul;
            }
            // loss is the class negative log likelihood
            return -Math.log(this.es[y]);
        };
        SoftmaxLayer.prototype.updateDimensions = function (pred) {
            if (pred) {
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
    var nj = NumJS;
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
            this.out_act = V;
            return V; // identity function
        };
        SVMLayer.prototype.backward = function (y) {
            // compute and accumulate gradient wrt weights and bias of this layer
            var x = this.in_act;
            x.dw = nj.zeros(x.w.length); // zero out the gradient of input Vol
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
                this.in_sx = pred.out_sx;
                this.in_sy = pred.out_sy;
                this.in_depth = pred.out_depth;
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
    var nj = NumJS;
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
            var A = V.cloneAndZero();
            this.S_cache_ = V.cloneAndZero();
            var n2 = Math.floor(this.n / 2);
            for (var x = 0; x < V.sx; x++) {
                for (var y = 0; y < V.sy; y++) {
                    for (var i = 0; i < V.depth; i++) {
                        var ai = V.get(x, y, i);
                        // normalize in a window of size n
                        var den = 0.0;
                        for (var j = Math.max(0, i - n2); j <= Math.min(i + n2, V.depth - 1); j++) {
                            var aa = V.get(x, y, j);
                            den += aa * aa;
                        }
                        den *= this.alpha / this.n;
                        den += this.k;
                        this.S_cache_.set(x, y, i, den); // will be useful for backprop
                        den = Math.pow(den, this.beta);
                        A.set(x, y, i, ai / den);
                    }
                }
            }
            this.out_act = A;
            return this.out_act; // dummy identity function for now
        };
        LocalResponseNormalizationLayer.prototype.backward = function () {
            // evaluate gradient wrt data
            var V = this.in_act; // we need to set dw of this
            V.dw = nj.zeros(V.w.length); // zero out gradient wrt data
            var A = this.out_act; // computed in forward pass 
            var n2 = Math.floor(this.n / 2);
            for (var x = 0; x < V.sx; x++) {
                for (var y = 0; y < V.sy; y++) {
                    for (var i = 0; i < V.depth; i++) {
                        var chain_grad = this.out_act.get_grad(x, y, i);
                        var S = this.S_cache_.get(x, y, i);
                        var SB = Math.pow(S, this.beta);
                        var SB2 = SB * SB;
                        // normalize in a window of size n
                        for (var j = Math.max(0, i - n2); j <= Math.min(i + n2, V.depth - 1); j++) {
                            var aj = V.get(x, y, j);
                            var g = -aj * this.beta * Math.pow(S, this.beta - 1) * this.alpha / this.n * 2 * aj;
                            if (j === i)
                                g += SB;
                            g /= SB2;
                            g *= chain_grad;
                            V.add_grad(x, y, j, g);
                        }
                    }
                }
            }
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
                .then(function (model) { return _this.create(model); });
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
                    opt.pred = this.layers.get(layerOpt.bottom);
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
                    opt.n = opt.local_size !== undefined ? +p.local_size : undefined;
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
/// <reference path="GraphDrawer.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="NumJS/index.ts" />
/// <reference path="Parser/index.ts" />
/// <reference path="Net/index.ts" />
/// <reference path="Utils/index.ts" /> 

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk51bUpTL3NyYy9BcnJheS50cyIsIk51bUpTL3NyYy9NaW5NYXgudHMiLCJOdW1KUy9zcmMvUmFuZG9tLnRzIiwiTnVtSlMvc3JjL1V0aWxzLnRzIiwiTnVtSlMvc3JjL19pbmRleC50cyIsIk51bUpTL2luZGV4LnRzIiwiUGFyc2VyL3NyYy9CYXNlUGFyc2VyLnRzIiwiUGFyc2VyL3NyYy9Qcm90b3R4dFBhcnNlci50cyIsIlBhcnNlci9zcmMvX2luZGV4LnRzIiwiUGFyc2VyL2luZGV4LnRzIiwiTmV0L3NyYy9Wb2wudHMiLCJOZXQvc3JjL05ldC50cyIsIk5ldC9zcmMvVXRpbHMudHMiLCJOZXQvc3JjL0xheWVycy9CYXNlTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9JbnB1dExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvQ29uY2F0TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Db252TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Qb29sTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9GdWxseUNvbm5lY3RlZExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvRHJvcG91dExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvVGFuaExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvTWF4b3V0TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9SZWx1TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9TaWdtb2lkTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9SZWdyZXNzaW9uTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Tb2Z0bWF4TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9TVk1MYXllci50cyIsIk5ldC9zcmMvTGF5ZXJzL0xvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9faW5kZXgudHMiLCJOZXQvc3JjL0NhZmZlTW9kZWwudHMiLCJOZXQvc3JjL19pbmRleC50cyIsIk5ldC9pbmRleC50cyIsIlV0aWxzL3NyYy9HcmFwaERyYXdlci50cyIsIlV0aWxzL3NyYy9faW5kZXgudHMiLCJVdGlscy9pbmRleC50cyIsImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBVSxLQUFLLENBaUdkO0FBakdELFdBQVUsS0FBSyxFQUFDLENBQUM7SUFJSiwyQkFBcUIsR0FBRyxZQUFZLENBQUM7SUFFaEQsZUFBc0IsQ0FBUyxFQUFFLEtBQTZCO1FBQTdCLHFCQUE2QixHQUE3QixtQ0FBNkI7UUFDNUQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFGZSxXQUFLLFFBRXBCLENBQUE7SUFFRCxjQUFxQixDQUFDLEVBQUUsQ0FBQztRQUN2QixzREFBc0Q7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUplLFVBQUksT0FJbkIsQ0FBQTtJQUVELGNBQXFCLENBQUM7UUFDcEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUplLFVBQUksT0FJbkIsQ0FBQTtJQUVELGFBQW9CLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENB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QUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFFRCxtQkFBSyxHQUFMO1lBQ0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO1FBRUQsMEJBQVksR0FBWjtZQUNFLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO1FBRUQsaUJBQUcsR0FBSCxVQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNULElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxpQkFBRyxHQUFILFVBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNaLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FB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QyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDVixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzdCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQy9CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUUsSUFB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LEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFFakMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNoQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO3dCQUVsQixrQ0FBa0M7d0JBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDMUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFD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Z0JBQ2pDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsS0FBSztpQkFDUCxNQUFNLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLFNBQVMsRUFBaEQsQ0FBZ0QsQ0FBQztpQkFDbEUsT0FBTyxDQUFDLFVBQUMsSUFBSTtnQkFDWixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtvQkFDNUIsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUM3RCxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVMLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRU0sbUJBQU8sR0FBZCxVQUFlLEtBQWM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxXQUFXLENBQUM7WUFDeEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUNILGtCQUFDO0lBQUQsQ0FuRUEsQUFtRUMsQ0FuRWdDLEdBQUcsQ0FBQyxHQUFHLEdBbUV2QztJQW5FWSxpQkFBVyxjQW1FdkIsQ0FBQTtBQUNILENBQUMsRUF0RVMsS0FBSyxLQUFMLEtBQUssUUFzRWQ7QUN4RUQsdUNBQXVDO0FDQXZDLHNDQUFzQztBQ0F0Qyx1Q0FBdUM7QUFDdkMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx1Q0FBdUMiLCJmaWxlIjoiY2FmZmUuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
