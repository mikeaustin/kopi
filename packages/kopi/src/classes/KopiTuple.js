const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiTuple {
  static empty = new KopiTuple(null);

  constructor(elements = []) {
    if (elements === null) {
      this.elements = [];

      return this;
    }

    if (elements.length === 0) {
      console.log('Use KopiTuple.empty instead of calling KopiTuple([]).');

      return KopiTuple.empty;
    }

    elements.forEach((element, index) => this[index] = element);

    this.elements = elements;
  }

  // Array.prototype.toString = async function () {
  //   const elements = await Promise.all(this.map(async element => (await element).toString()));

  //   return `[${elements.join(', ')}]`;
  // };

  async toStringAsync() {
    if (this.elements.length === 0) {
      return '()';
    }

    const elements = await Promise.all(this.elements.map(async element => (await element).toStringAsync()));

    return `(${elements.join(', ')})`;
  }

  [util.inspect.custom]() {
    return `(${this.elements.map(element => inspect(element)).join(', ')})`;
  }

  ['=='](that) {
    if (!(that instanceof KopiTuple)) {
      return false;
    }

    // TODO: Optimization for numbers
    return this.elements.every((element, index) => that.elements[index]['=='](element));
  }

  map(mapper, scope, visitors) {
    const iters = this.elements.map(element => element[Symbol.iterator]());
    const values = [];

    let results = iters.map(iter => iter.next());

    while (results.every(result => !result.done)) {
      values.push(
        mapper.apply(undefined, [new KopiTuple(results.map(result => result.value)), scope, visitors])
      );

      results = iters.map(iter => iter.next());
    }

    return Promise.all(values);
  }
}

module.exports = {
  default: KopiTuple,
};
