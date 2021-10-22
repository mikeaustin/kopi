const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiTuple {
  static empty = new KopiTuple(null);

  constructor(elementsArray = [], fields = []) {
    if (elementsArray === null) {
      this._elementsArray = [];
      this._fields = [];

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

    this._elementsArray = elementsArray;
    this._fields = fields;
  }

  // getElementAtIndex()
  getElementsArray() {
    return this._elementsArray;
  }

  async toStringAsync() {
    if (this._elementsArray.length === 0) {
      return '()';
    }

    const elementsArray = await Promise.all(
      this._elementsArray.map(async element => (await (await element).toStringAsync()))
    );

    return `(${elementsArray.map((element, index) => (
      `${this._fields[index] ? `${this._fields[index]}: ` : ''}${element}`
    )).join(', ')})`;
  }

  [util.inspect.custom]() {
    return `(${this._elementsArray.map(element => inspect(element)).join(', ')})`;
  }

  async ['=='](that) {
    if (!(that instanceof KopiTuple)) {
      return false;
    }

    // TODO: Optimization for numbers

    for (const [index, element] of this._elementsArray.entries()) {
      if (!await (await element)['=='](await that._elementsArray[index])) {
        return false;
      }
    }

    return true;
  }

  async ['!='](that) {
    return !await this['=='](that);
  }

  map(mapper, scope, visitors) {
    const iters = this._elementsArray.map(element => element[Symbol.iterator]());
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
