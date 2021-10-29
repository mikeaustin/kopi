class KopiVector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  inspectAsync() {
    return `Vector (${this.x}, ${this.y})`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  ['+'](that) {
    return new KopiVector(this.x + that.x, this.y + that.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

module.exports = {
  default: KopiVector,
};
