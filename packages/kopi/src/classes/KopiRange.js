const util = require("util");

const { default: KopiTuple } = require('./KopiTuple');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiRangeWithIndex {
  constructor(range) {
    this._range = range;
  }

  map(func, scope, visitors) {
    let index = 0;

    return this._range.map(element => (
      func.apply(undefined, [new KopiTuple([element, index++]), scope, visitors])
    ));
  }
}

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

  withIndex() {
    return new KopiRangeWithIndex(this);
  }

  async map(func, scope, visitors) {
    const values = [];

    for (let index = this.from; index <= this.to; index = index.succ()) {
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

  async flatMap(func, scope, visitors) {
    let accum = [];

    for (let index = this.from; index['<='](this.to); index = index.succ()) {
      accum.push(...await func.apply(undefined, [index, scope, visitors]));
    }

    return accum;
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
