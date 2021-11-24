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
  constructor(from, to, by = 1) {
    this.from = from;
    this.to = to;
    this.by = by;
  }

  resolve() {
    return Promise.all([this.from, this.to, this.by]);
  }

  async inspectAsync() {
    const [from, to, by] = await this.resolve();

    return `${await (from).inspectAsync()}..${await (to).inspectAsync()}${by > 1 ? ` @ ${by}` : ''}`;
  }

  async toStringAsync() {
    return this.inspectAsync();
  }

  async toArray() {
    const [from, to, by] = await this.resolve();

    return new KopiArray(
      Array.from({ length: (to - from) / by + 1 }, (_, index) => index * by + from),
    );
  }

  emptyValue() {
    return new KopiArray();
  }

  async *[Symbol.asyncIterator]() {
    const [from, to, by] = await this.resolve();

    for (let element = from; element['<='](to); element = element.succ(by)) {
      yield element;
    }
  }

  *[Symbol.iterator]() {
    for (let element = this.from; element['<='](this.to); element = element.succ(this.by)) {
      yield element;
    }
  }

  async apply(thisArg, [by]) {
    const [from, to] = await this.resolve();

    return new KopiRange(from, to, await by);
  }

  ['++'](that) {
    return this.toArray().concat(that.toArray());
  }

  withIndex() {
    return new KopiRangeWithIndex(this);
  }
}

module.exports = {
  default: KopiRange,
};

const { default: KopiTuple } = require('./KopiTuple');
const { default: KopiArray } = require('./KopiArray');
const { default: Iterable } = require('../traits/Iterable');

KopiRange.prototype.each = Iterable.prototype.each;
KopiRange.prototype.map = Iterable.prototype.map;
KopiRange.prototype.flatMap = Iterable.prototype.flatMap;
KopiRange.prototype.reduce = Iterable.prototype.reduce;
KopiRange.prototype.splitOn = Iterable.prototype.splitOn;
KopiRange.prototype.count = Iterable.prototype.count;
