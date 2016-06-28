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
            canvas.width = this.image.width;
            canvas.height = this.image.height;
            var ctx = canvas.getContext('2d');
            var img = ctx.getImageData(0, 0, this.image.width, this.image.height);
            img.data.set(this.data);
            ctx.putImageData(img, 0, 0);
        };
        // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
        // hence we need to also convert them back to RGB
        Image.prototype.fromVol = function (vol, mean, channels, aplha) {
            if (channels === void 0) { channels = [2, 1, 0]; }
            if (aplha === void 0) { aplha = 255; }
            mean = mean !== undefined ? mean : [0, 0, 0];
            var w = vol.sx;
            var h = vol.sy;
            var n = w * h * 4;
            var c0 = channels[0];
            var c1 = channels[1];
            var c2 = channels[2];
            var data = new Uint8ClampedArray(n);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pp = (y * w + x) * 4;
                    var mean_0 = mean[c0] instanceof Array ? +mean[c0][y * h + x] : +mean[c0];
                    var mean_1 = mean[c1] instanceof Array ? +mean[c1][y * h + x] : +mean[c1];
                    var mean_2 = mean[c2] instanceof Array ? +mean[c2][y * h + x] : +mean[c2];
                    data[pp + 0] = vol.get(x, y, c0) + mean_0;
                    data[pp + 1] = vol.get(x, y, c1) + mean_1;
                    data[pp + 2] = vol.get(x, y, c2) + mean_2;
                    data[pp + 3] = aplha;
                }
            }
            this.image.width = w;
            this.image.height = h;
            this.data = data;
            return this;
        };
        // Caffe uses OpenCV to load JPEGs and leaves them in their default BGR order
        // hence we need to also convert to BGR order
        // Also mean should be provided in this format
        Image.prototype.toVol = function (mean, channels) {
            if (channels === void 0) { channels = [2, 1, 0]; }
            mean = mean !== undefined ? mean : [0, 0, 0];
            var w = this.image.width;
            var h = this.image.height;
            var c0 = channels[0];
            var c1 = channels[1];
            var c2 = channels[2];
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
/// <reference path="GraphDrawer.ts" /> 
/// <reference path="src/_index.ts" /> 
/// <reference path="NumJS/index.ts" />
/// <reference path="ImgJS/index.ts" />
/// <reference path="Parser/index.ts" />
/// <reference path="Net/index.ts" />
/// <reference path="Utils/index.ts" /> 

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk51bUpTL3NyYy9BcnJheS50cyIsIk51bUpTL3NyYy9NaW5NYXgudHMiLCJOdW1KUy9zcmMvUmFuZG9tLnRzIiwiTnVtSlMvc3JjL1V0aWxzLnRzIiwiTnVtSlMvc3JjL19pbmRleC50cyIsIk51bUpTL2luZGV4LnRzIiwiTmV0L3NyYy9Wb2wudHMiLCJOZXQvc3JjL05ldC50cyIsIlBhcnNlci9zcmMvQmFzZVBhcnNlci50cyIsIlBhcnNlci9zcmMvUHJvdG90eHRQYXJzZXIudHMiLCJQYXJzZXIvc3JjL19pbmRleC50cyIsIlBhcnNlci9pbmRleC50cyIsIk5ldC9zcmMvVXRpbHMudHMiLCJOZXQvc3JjL0xheWVycy9CYXNlTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9JbnB1dExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvQ29uY2F0TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Db252TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Qb29sTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9GdWxseUNvbm5lY3RlZExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvRHJvcG91dExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvVGFuaExheWVyLnRzIiwiTmV0L3NyYy9MYXllcnMvTWF4b3V0TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9SZWx1TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9TaWdtb2lkTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9SZWdyZXNzaW9uTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9Tb2Z0bWF4TGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9TVk1MYXllci50cyIsIk5ldC9zcmMvTGF5ZXJzL0xvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uTGF5ZXIudHMiLCJOZXQvc3JjL0xheWVycy9faW5kZXgudHMiLCJOZXQvc3JjL0NhZmZlTW9kZWwudHMiLCJOZXQvc3JjL19pbmRleC50cyIsIk5ldC9pbmRleC50cyIsIkltZ0pTL3NyYy9JbWFnZS50cyIsIkltZ0pTL3NyYy9faW5kZXgudHMiLCJJbWdKUy9pbmRleC50cyIsIlV0aWxzL3NyYy9HcmFwaERyYXdlci50cyIsIlV0aWxzL3NyYy9faW5kZXgudHMiLCJVdGlscy9pbmRleC50cyIsImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBVSxLQUFLLENBaUdkO0FBakdELFdBQVUsS0FBSyxFQUFDLENBQUM7SUFJSiwyQkFBcUIsR0FBRyxZQUFZLENBQUM7SUFFaEQsZUFBc0IsQ0FBUyxFQUFFLEtBQTZCO1FBQTdCLHFCQUE2QixHQUE3QixtQ0FBNkI7UUFDNUQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFGZSxXQUFLLFFBRXBCLENBQUE7SUFFRCxjQUFxQixDQUFDLEVBQUUsQ0FBQztRQUN2QixzREFBc0Q7UUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUplLFVBQUksT0FJbkIsQ0FBQTtJQUVELGNBQXFCLENBQUM7UUFDcEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUplLFVBQUksT0FJbkIsQ0FBQTtJQUVELGFBQW9CLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FB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QUssR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxzQkFBUSxHQUFSLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVELHNCQUFRLEdBQVIsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2pCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFRCxzQkFBUSxHQUFSLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixDQUFDO1FBRUQsc0JBQVEsR0FBUixVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDakIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdB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LEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDakQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNWLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzdCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFD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QUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQzlDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUN0QixNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDdkIsQ0FBQztZQUNILENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUM5QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDO3dCQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDOzRCQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxH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WUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMzQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBQ3RDLENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sdUNBQXVDO2dCQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7Z0JBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDM0IsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN0QyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzs0QkFDL0MsQ0FBQyxFQUFFLENBQUM7d0JBQ04sQ0FBQztv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SSxDQUFDLEdBQUcsQ0FBQztpQkFDN0QsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFTCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVNLG1CQUFPLEdBQWQsVUFBZSxLQUFjO1lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN4QixDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFDSCxrQkFBQztJQUFELENBbkVBLEFBbUVDLENBbkVnQyxHQUFHLENBQUMsR0FBRyxHQW1FdkM7SUFuRVksaUJBQVcsY0FtRXZCLENBQUE7QUFDSCxDQUFDLEVBdEVTLEtBQUssS0FBTCxLQUFLLFFBc0VkO0FDeEVELHVDQUF1QztBQ0F2QyxzQ0FBc0M7QUNBdEMsdUNBQXVDO0FBQ3ZDLHVDQUF1QztBQUN2Qyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHVDQUF1QyIsImZpbGUiOiJjYWZmZS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGxdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
