const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiTuple {
  static empty = new KopiTuple(null);

  constructor(elementsArray = [], fieldsArray = []) {
    if (elementsArray === null) {
      this._elementsArray = [];
      this._fieldsArray = [];

      return this;
    }

    if (elementsArray.length === 0) {
      console.log('Use KopiTuple.empty instead of calling KopiTuple([]).');

      return KopiTuple.empty;
    }

    elementsArray.forEach((element, index) => {
      this[index] = element;
      this[fieldsArray[index]] = element;
    });

    this._elementsArray = elementsArray;
    this._fieldsArray = fieldsArray;
  }

  getElementsArray() {
    return this._elementsArray;
  }

  getElementAtIndex(index) {
    return this._elementsArray[index];
  }

  getFieldNamesArray() {
    return this._fieldsArray;
  }

  getFieldNameAtIndex(index) {
    return this._fieldsArray[index];
  }

  getIndexOfFieldName(fieldName) {
    return this._fieldsArray.indexOf(fieldName);
  }

  async toStringAsync() {
    if (this._elementsArray.length === 0) {
      return '()';
    }

    const elementsArray = await Promise.all(
      this._elementsArray.map(async element => (await (await element).toStringAsync()))
    );

    return `(${elementsArray.map((element, index) => (
      `${this._fieldsArray[index] ? `${this._fieldsArray[index]}: ` : ''}${element}`
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
