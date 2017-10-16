namespace NumJS {

  type DEFAULT_TYPE = Float32Array;

  export var DEFAULT_TYPE_INSTANCE = Float32Array;

  export function zeros(n: number, dtype = DEFAULT_TYPE_INSTANCE) {
    return new dtype(n);
  }

  export function fill(A, b) {
    // Note, this is faster than the native .fill() method
    for (let i = 0, len = A.length; i < len; ++i) A[i] = b;
    return A;
  }

  export function prod(A) {
    var prev = 1.0;
    for (let i = 0, len = A.length; i < len; ++i) prev *= A[i];
    return prev;
  }

  export function sum(A) {
    var prev = 0.0;
    for (let i = 0, len = A.length; i < len; ++i) prev += A[i];
    return prev;
  }

  export function add(A, B) {
    if (A.length === B.length) {
      for (let i = 0, len = A.length; i < len; ++i) A[i] += B[i];
      return A;
    }
    else {
      throw new TypeError("Bad input shapes " + A.length + " " + B.length);
    }
  }

  export function addConst(A, b) {
    for (let i = 0, len = A.length; i < len; ++i) A[i] += b;
    return A;
  }

  export function sub(A, B) {
    if (A.length === B.length) {
      for (let i = 0, len = A.length; i < len; ++i) A[i] -= B[i];
      return A;
    }
    else {
      throw new TypeError("Bad input shape " + A.length + " " + B.length);
    }
  }

  export function subConst(A, b) {
    for (let i = 0, len = A.length; i < len; ++i) A[i] -= b;
    return A;
  }

  export function mul(A, B) {
    if (A.length === B.length) {
      for (let i = 0, len = A.length; i < len; ++i) A[i] *= B[i];
      return A;
    }
    else {
      throw new TypeError("Bad input shape " + A.length + " " + B.length);
    }
  }

  export function mulByConst(A, b) {
    for (let i = 0, len = A.length; i < len; ++i) A[i] *= b;
    return A;
  }

  export function div(A, B) {
    if (A.length === B.length) {
      for (let i = 0, len = A.length; i < len; ++i) A[i] /= B[i];
      return A;
    }
    else {
      throw new TypeError("Bad input shape " + A.length + " " + B.length);
    }
  }

  export function divByConst(A, b) {
    for (let i = 0, len = A.length; i < len; ++i) A[i] /= b;
    return A;
  }

  export function addScaled(A, B, c) {
    if (A.length === B.length) {
      for (let i = 0, len = A.length; i < len; ++i) A[i] += c * B[i];
      return A;
    }
    else {
      throw new TypeError("Bad input shape " + A.length + " " + B.length);
    }
  }
}
