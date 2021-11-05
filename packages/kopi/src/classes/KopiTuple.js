const util = require('util');

class KopiTuple {
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

  async inspectAsync() {
    if (this._elementsArray.length === 0) {
      return '()';
    }

    const elementsArray = await Promise.all(
      this._elementsArray.map(async (element) => (await (await element).inspectAsync())),
    );

    return `(${elementsArray.map((element, index) => (
      `${this._fieldsArray[index] ? `${this._fieldsArray[index]}: ` : ''}${element}`
    )).join(', ')})`;
  }

  async toStringAsync() {
    return this.inspectAsync();
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

  async hasErrors() {
    for await (const element of this._elementsArray) {
      if (element.constructor.name === 'Error') {
        return true;
      }
    }

    return false;
  }

  async errors() {
    const messages = [];

    for await (const element of this._elementsArray) {
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

  async map(mapper, scope, visitors) {
    const iters = this._elementsArray.map((element) => element[Symbol.iterator]());
    const values = [];

    let results = iters.map((iter) => iter.next());

    while (results.every((result) => !result.done)) {
      values.push(
        mapper.apply(undefined, [new KopiTuple(results.map((result) => result.value)), scope, visitors]),
      );

      results = iters.map((iter) => iter.next());
    }

    return new KopiArray(await Promise.all(values));
  }

  async product(func = (args) => args, scope, visitors) {
    const helper = async (index, values) => {
      const iter = this._elementsArray[index][Symbol.iterator]();
      const accum = [];

      let result = iter.next();

      while (!result.done) {
        if (index === this._elementsArray.length - 1) {
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
