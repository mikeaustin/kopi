const util = require('util');

class KopiRangeWithIndex {
  constructor(range) {
    this._range = range;
  }

  map(func, scope, visitors) {
    let index = 0;

    return this._range.map((element) => (
      func.apply(undefined, [new KopiTuple([element, index++]), scope, visitors])
    ));
  }
}

class KopiRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  async inspectAsync() {
    return `${await (await this.from).inspectAsync()}..${await (await this.to).inspectAsync()}`;
  }

  async toStringAsync() {
    return this.inspectAsync();
  }

  toArray() {
    return new KopiArray(
      Array.from({ length: this.to - this.from + 1 }, (_, index) => index + this.from),
    );
  }

  *[Symbol.iterator]() {
    for (let element = this.from; element['<='](this.to); element = element.succ()) {
      yield element;
    }
  }

  ['++'](that) {
    return this.toArray().concat(that.toArray());
  }

  withIndex() {
    return new KopiRangeWithIndex(this);
  }

  async map(func, scope, visitors) {
    const values = [];

    for (let element of this) {
      // const argumentsPassed = func.params.getMatches(index);
      const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
        ...scope,
        [func.params.name]: element,
      }));

      if (predicatePassed) {
        values.push(await func.apply(undefined, [element, scope, visitors]));
      }
    }

    return new KopiArray(values);
  }

  async flatMap(func, scope, visitors) {
    let accum = [];

    for (let element of this) {
      const appliedElement = await func.apply(undefined, [await element, scope, visitors]);

      if (appliedElement[Symbol.iterator]) {
        accum.push(...appliedElement);
      } else {
        accum.push(appliedElement);
      }
    }

    return new KopiArray(accum);
  }

  async reduce(init) {
    let accum = init;

    return (func, scope, visitors) => {
      for (let element of this) {
        accum = func.apply(undefined, [new KopiTuple([accum, element]), scope, visitors]);
      }

      return accum;
    };
  }
}

module.exports = {
  default: KopiRange,
};

const { default: KopiTuple } = require('./KopiTuple');
const { default: KopiArray } = require('./KopiArray');
