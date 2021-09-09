class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  ['+'](that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

module.exports = {
  default: Vector,
};
