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

  async map(args, scope, visitors) {
    const values = [];

    for (let index = this.from; index <= this.to; index++) {
      values.push(await args.apply(undefined, [index + this.from, scope, visitors]));
    }

    return values;

    return Promise.all(Array.from({ length: this.to - this.from + 1 }, async (_, index) => (
      await args.apply(undefined, [index + this.from, scope, visitors])
    )));
  }
}

module.exports = {
  default: KopiRange,
};
