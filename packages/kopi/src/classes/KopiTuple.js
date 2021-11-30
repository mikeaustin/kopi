class KopiSequence {
  constructor(sequence) {
    this.sequence = sequence;
  }

  async inspectAsync() {
    const values = [];

    for await (const element of this.sequence) {
      values.push(element);
    }

    return new KopiArray(values).inspectAsync();
  }

  emptyValue() {
    return new KopiArray();
  }

  [Symbol.asyncIterator]() {
    return this.sequence[Symbol.asyncIterator]();
  }
}

class KopiTuple {
  constructor(elementsArray = [], fieldsArray = []) {
    if (elementsArray === null) {
      this._fieldsArray = [];
      this._fieldNamesArray = [];

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

    this._fieldsArray = elementsArray;
    this._fieldNamesArray = fieldsArray;
  }

  async inspectAsync() {
    if (this._fieldsArray.length === 0) {
      return '()';
    }

    const elementsArray = await Promise.all(
      this._fieldsArray.map(async (element) => (await (await element).inspectAsync())),
    );

    const typeName = this.constructor.name !== 'KopiTuple' ? `${this.constructor.name} ` : '';

    return `${typeName}(${elementsArray.map((element, index) => (
      `${this._fieldNamesArray[index] ? `${this._fieldNamesArray[index]}: ` : ''}${element}`
    )).join(', ')})`;
  }

  async toStringAsync() {
    return this.inspectAsync();
  }

  getFieldsArray() {
    return this._fieldsArray;
  }

  getElementAtIndex(index) {
    return this._fieldsArray[index];
  }

  getFieldNamesArray() {
    return this._fieldNamesArray;
  }

  getFieldNameAtIndex(index) {
    return this._fieldNamesArray[index];
  }

  getIndexOfFieldName(fieldName) {
    return this._fieldNamesArray.indexOf(fieldName);
  }

  getElementWithFieldName(fieldName) {
    return this._fieldsArray[this._fieldNamesArray.indexOf(fieldName)];
  }

  async hasErrors() {
    for await (const element of this._fieldsArray) {
      if (element.constructor.name === 'Error') {
        return true;
      }
    }

    return false;
  }

  async errors() {
    const messages = [];

    for await (const element of this._fieldsArray) {
      if (element.constructor.name === 'Error') {
        messages.push(element.message);
      }
    }

    return messages;
  }

  async ['=='](that) {
    if (!(that instanceof KopiTuple)) {
      return false;
    }

    // TODO: Optimization for numbers

    for (const [index, element] of this._fieldsArray.entries()) {
      if (!await (await element)['=='](await that._fieldsArray[index])) {
        return false;
      }
    }

    return true;
  }

  async ['!='](that) {
    return !await this['=='](that);
  }

  async map(mapper, scope, visitors) {
    const iters = this._fieldsArray.map((element) => element[Symbol.iterator]());
    const values = [];

    let results = iters.map((iter) => iter.next());

    while (results.every((result) => !result.done)) {
      values.push(
        mapper.apply(undefined, [new KopiTuple(results.map((result) => result.value)), scope, visitors])
      );

      results = iters.map((iter) => iter.next());
    }

    return new KopiArray(await Promise.all(values));
  }

  async map2(mapper, scope, visitors) {
    return new KopiSequence((async function* map() {
      const iters = this._fieldsArray.map((element) => element[Symbol.iterator]());

      let results = iters.map((iter) => iter.next());

      while (results.every((result) => !result.done)) {
        yield mapper.apply(undefined, [new KopiTuple(results.map((result) => result.value)), scope, visitors]);

        results = iters.map((iter) => iter.next());
      }
    }).apply(this));
  }

  async product(func = (args) => args, scope, visitors) {
    const helper = async (index, values) => {
      const iter = this._fieldsArray[index][Symbol.iterator]();
      const accum = [];

      let result = iter.next();

      while (!result.done) {
        if (index === this._fieldsArray.length - 1) {
          accum.push(await func.apply(undefined, [new KopiTuple([...values, result.value]), scope, visitors]));
        } else {
          accum.push(...await helper(index + 1, [...values, result.value]));
        }

        result = iter.next();
      }

      return new KopiArray(accum);
    };

    return helper(0, []);
  }
}

KopiTuple.empty = new KopiTuple(null);

module.exports = {
  default: KopiTuple,
};

const { default: KopiArray } = require('./KopiArray');
const { default: Iterable } = require('../traits/Iterable');

KopiSequence.prototype.map = Iterable.prototype.map;
KopiSequence.prototype.flatMap = Iterable.prototype.flatMap;
KopiSequence.prototype.reduce = Iterable.prototype.reduce;
KopiSequence.prototype.find = Iterable.prototype.find;
KopiSequence.prototype.splitOn = Iterable.prototype.splitOn;
KopiSequence.prototype.splitEvery = Iterable.prototype.splitEvery;
KopiSequence.prototype.count = Iterable.prototype.count;
