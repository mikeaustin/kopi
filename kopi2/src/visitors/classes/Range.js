const { TupleType } = require("../types/TupleType");

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;

    for (let index = 0; index < this.to - this.from + 1; ++index) {
      this[index] = index + this.from;
    };
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
}

module.exports = {
  default: Range,
};
