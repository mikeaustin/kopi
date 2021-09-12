const util = require("util");

class KopiRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  [util.inspect.custom]() {
    return `${this.from}..${this.to}`;
  }

  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i = i.succ()) {
      yield i;
    }
  }

  map(args, scope, visitors) {
    return Promise.all(Array.from({ length: this.to - this.from + 1 }, (_, index) => (
      args.apply(undefined, [index + this.from, scope, visitors])
    )));
  }
}

module.exports = {
  default: KopiRange,
};
