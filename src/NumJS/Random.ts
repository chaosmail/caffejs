namespace NumJS {
  var cached: boolean = false;
  var cachedVal: number = 0.0;

  export function gaussRandom() {
    if (cached) {
      cached = false;
      return cachedVal;
    }
    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2 * Math.log(r) / r);
    cachedVal = v * c; // cache this
    cached = true;
    return u * c;
  }

  export function randf(a: number, b: number) { return Math.random() * (b - a) + a; }
  export function randi(a: number, b: number) { return Math.floor(Math.random() * (b - a) + a); }
  export function randn(mu: number, std: number) { return mu + gaussRandom() * std; }

  // create random permutation of numbers, in range [0...n-1]
  export function randperm(n) {
    var i = n;
    var j = 0;
    var temp;
    var arr = [];
    for(let q = 0; q < n; ++q) arr[q] = q;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
  }
}
