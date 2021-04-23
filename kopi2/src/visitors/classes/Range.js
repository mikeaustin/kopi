const { TupleType } = require("../types");

class Range {
  constructor(from, to, step = 1) {
    this.from = from;
    this.to = to;
    this.step = step;
  }

  escape() {
    return `${this.from.escape()}..${this.to.escape()}`;
  }

  //

  valueForField(field) {
    if (typeof field === 'number') {
      return field + this.from <= this.to ? this.from + field : TupleType();
    }
  }

  apply(args) {
    return new Range(this.from, this.to, args);
  }
}

module.exports = {
  default: Range,
};
