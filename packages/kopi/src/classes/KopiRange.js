const util = require("util");

const { default: KopiTuple } = require('./KopiTuple');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  [util.inspect.custom]() {
    return `${inspect(this.from)}..${inspect(this.to)}`;
  }

  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i = i.succ()) {
      yield i;
    }
  }

  toArray() {
    return Array.from({ length: this.to - this.from + 1 }, (_, index) => index + this.from);
  }

  ['++'](that) {
    return this.toArray().concat(that.toArray());
  }

  async map(func, scope, visitors) {
    const values = [];

    for (let index = this.from; index <= this.to; index++) {
      // const argumentsPassed = func.params.getMatches(index);
      const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
        ...scope,
        [func.params.name]: index
      }));

      if (predicatePassed) {
        values.push(await func.apply(undefined, [index, scope, visitors]));
      }
    }

    return values;
  }

  async reduce(init) {
    let accum = init;

    return (func, scope, visitors) => {
      for (let index = this.from; index['<='](this.to); index = index.succ()) {
        accum = func.apply(undefined, [new KopiTuple([accum, index]), scope, visitors]);
      }

      return accum;
    };
  }
}

module.exports = {
  default: KopiRange,
};
