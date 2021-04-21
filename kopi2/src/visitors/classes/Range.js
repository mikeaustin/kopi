const { TupleType } = require("../types/TupleType");

class Range {
  constructor(from, to, step) {
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
      return this[field] ?? new TupleType();
    }
  }

  apply(args) {
    return new Range(this.from, this.to, args);
  }
}

module.exports = {
  default: Range,
};
