/// <reference path="../NumJS/_module.ts" />

namespace Net {
  
  const nj = NumJS;

  // sample from list lst according to probabilities in list probs
  // the two lists are of same size, and probs adds up to 1
  export function weightedSample(lst, probs) {
    var p = nj.randf(0, 1.0);
    var cumprob = 0.0;
    for (var k = 0, n = lst.length; k < n; k++) {
      cumprob += probs[k];
      if (p < cumprob) { return lst[k]; }
    }
  }

  // syntactic sugar function for getting default parameter values
  export function getopt(opt: any = {}, field_name, default_value) {
    if (typeof field_name === 'string') {
      // case of single string
      return (opt[field_name] !== undefined) ? opt[field_name] : default_value;
    } else {
      // assume we are given a list of string instead
      var ret = default_value;
      field_name.forEach((f) => {
        ret = opt[f] !== undefined ? opt[f] : ret;
      });
      return ret;
    }
  }

  export function assert(condition, message) {
    if (!condition) {
      message = message || "Assertion failed";
      if (typeof Error !== "undefined") {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  }

  export function arrContains(arr, elt) {
    for (var i = 0, n = arr.length; i < n; i++) {
      if (arr[i] === elt) return true;
    }
    return false;
  }

  export function arrUnique(arr) {
    var b = [];
    for (var i = 0, n = arr.length; i < n; i++) {
      if (!arrContains(b, arr[i])) {
        b.push(arr[i]);
      }
    }
    return b;
  }
}

