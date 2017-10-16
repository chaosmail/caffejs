namespace NumJS {
  export function clip(value, min, max) { return Math.max(Math.min(value, max), min); }
  export function mod(a, b) { return ((a % b) + b) % b; }
  export function tanh(x) { var y = Math.exp(2 * x); return (y - 1) / (y + 1); }
}
