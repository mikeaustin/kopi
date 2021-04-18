class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  escape() {
    return `${this.from.escape()}..${this.to.escape()}`;
  }
}

module.exports = {
  default: Range,
};
