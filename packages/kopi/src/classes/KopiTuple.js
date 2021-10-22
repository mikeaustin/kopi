const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiTuple {
  static empty = new KopiTuple(null);

  constructor(elementsArray = [], fields = []) {
    if (elementsArray === null) {
      this.elementsArray = [];
      this.fields = [];

      return this;
    }

    if (elementsArray.length === 0) {
      console.log('Use KopiTuple.empty instead of calling KopiTuple([]).');

      return KopiTuple.empty;
    }

    elementsArray.forEach((element, index) => {
      this[index] = element;
      this[fields[index]] = element;
    });

    this.elementsArray = elementsArray;
    this.fields = fields;
  }

  async toStringAsync() {
    if (this.elementsArray.length === 0) {
      return '()';
    }

    const elements = await Promise.all(
      this.elementsArray.map(async element => (await (await element).toStringAsync()))
    );

    return `(${elements.map((element, index) => (
      `${this.fields[index] ? `${this.fields[index]}: ` : ''}${element}`
    )).join(', ')})`;
  }

  [util.inspect.custom]() {
    return `(${this.elementsArray.map(element => inspect(element)).join(', ')})`;
  }

  async ['=='](that) {
    if (!(that instanceof KopiTuple)) {
      return false;
    }

    // TODO: Optimization for numbers

    for (const [index, element] of this.elementsArray.entries()) {
      if (!await (await element)['=='](await that.elementsArray[index])) {
        return false;
      }
    }

    return true;
  }

  async ['!='](that) {
    return !await this['=='](that);
  }

  map(mapper, scope, visitors) {
    const iters = this.elementsArray.map(element => element[Symbol.iterator]());
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
