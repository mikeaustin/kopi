const { TupleType } = require("../types/TupleType");

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
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
