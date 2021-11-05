const util = require('util');

const { default: KopiString } = require('./KopiString');
const { default: KopiTuple } = require('./KopiTuple');
const { default: Iterable } = require('../traits/Iterable');

class KopiArray {
  constructor(elementsArray = []) {
    elementsArray.forEach((element, index) => {
      this[index] = element;
    });

    this._elementsArray = elementsArray;
  }

  async inspectAsync() {
    const elementsArray = await Promise.all(
      this._elementsArray.map(async element => (await (await element).inspectAsync())),
    );

    return `[${elementsArray.map(element => element.toStringAsync()).join(', ')}]`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  [Symbol.iterator]() {
    return this._elementsArray[Symbol.iterator]();
  }

  toArray() {
    return this;
  }

  get(index) {
    if (index.constructor.name === 'KopiRange') {
      return this._elementsArray.slice(index.from, index.to);
    } else if (index.constructor.name === 'KopiTuple') {
      return index.getElementsArray().reduce((accum, index) => [...accum, this._elementsArray[index]], []);
    }

    return this._elementsArray[index];
  }

  emptyValue() {
    return new KopiArray();
  }

  size() {
    return this._elementsArray.length;
  }

  ['++'](that) {
    return new KopiArray(this._elementsArray.concat(that.toArray()._elementsArray));
  }

  async join(delimiter = new KopiString('')) {
    const elementsArray = await Promise.all(this._elementsArray);

    return new KopiString(
      elementsArray.map(element => element.getNativeString()).join(delimiter.getNativeString())
    );
  }

  async reverse(args, scope, visitors) {
    return new KopiArray(
      [...this._elementsArray].reverse(),
    );
  }

  async find(func, scope, visitors) {
    for await (const element of this._elementsArray) {
      if (await func.apply(undefined, [element, scope, visitors])) {
        return element;
      }
    }

    return KopiTuple.empty;
  }
}

KopiArray.prototype.map = Iterable.prototype.map;
KopiArray.prototype.flatMap = Iterable.prototype.flatMap;
KopiArray.prototype.reduce = Iterable.prototype.reduce;

module.exports = {
  default: KopiArray,
};
