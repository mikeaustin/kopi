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

  async inspectAsync() {
    return `${await (await this.from).inspectAsync()}..${await (await this.to).inspectAsync()}${this.by > 1 ? ` @ ${this.by}` : ''}`;
  }

  async toStringAsync() {
    return this.inspectAsync();
  }

  toArray() {
    return new KopiArray(
      Array.from({ length: this.to - this.from + 1 }, (_, index) => index + this.from),
    );
  }

  emptyValue() {
    return new KopiArray();
  }

  *[Symbol.iterator]() {
    for (let element = this.from; element['<='](this.to); element = element.succ(this.by)) {
      yield element;
    }
  }

  apply(thisArg, [by]) {
    return new KopiRange(this.from, this.to, by);
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

KopiRange.prototype.map = Iterable.prototype.map;
KopiRange.prototype.flatMap = Iterable.prototype.flatMap;
KopiRange.prototype.reduce = Iterable.prototype.reduce;
KopiRange.prototype.splitOn = Iterable.prototype.splitOn;
