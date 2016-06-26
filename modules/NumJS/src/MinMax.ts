namespace NumJS {
  export function max(A) {
    var max_ = Number.NEGATIVE_INFINITY;
    for (let i = 0, len = A.length; i < len; ++i) {
      if (A[i] > max_) {
        max_ = A[i];
      }
    }
    return max_;
  }

  export function argmax(A) {
    var max_ = Number.NEGATIVE_INFINITY;
    var idx = 0;
    for (let i = 0, len = A.length; i < len; ++i) {
      if (A[i] > max_) {
        max_ = A[i];
        idx = i;
      }
    }
    return idx;
  }

  export function maxn(A, n) {
    n = n || 3;
    return A.sort(function(a, b) {
      return b - a;
    }).slice(0, n);
  }

  export function argmaxn(A, n) {
    n = n || 3;
    var len = A.length;
    var indices = new Uint32Array(len);
    for (let i = 0; i < len; ++i) indices[i] = i;
    return indices.sort(function(a, b) {
      return A[b] - A[a];
    }).slice(0, n);
  }

  export function maxmin (w): any {
    if (w.length === 0) {
      return {};
    }
    var maxv = w[0];
    var minv = w[0];
    var maxi = 0;
    var mini = 0;
    for (let i = 1, len = w.length; i < len; ++i) {
      if (w[i] > maxv) { maxv = w[i]; maxi = i; }
      if (w[i] < minv) { minv = w[i]; mini = i; }
    }
    return { maxi: maxi, maxv: maxv, mini: mini, minv: minv, dv: maxv - minv };
  }
}