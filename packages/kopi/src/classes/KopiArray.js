class KopiArray {
  constructor(elementsArray = []) {
    elementsArray.forEach((element, index) => {
      this[index] = element;
    });

    this._elementsArray = elementsArray;
  }

  async inspectAsync({ formatted = false } = {}) {
    const elementsArray = await Promise.all(
      this._elementsArray.map(async (element) => (await (await element).inspectAsync())),
    );

    if (formatted) {
      return '[\n' + elementsArray.map((element) => `  ${element}`).join('\n') + '\n]';
    }

    return `[${elementsArray.join(', ')}]`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  getElementsArray() {
    return this._elementsArray;
  }

  [Symbol.iterator]() {
    return this._elementsArray[Symbol.iterator]();
  }

  toArray() {
    return this;
  }

  set(index) {
    return (value) => {
      const elementsArray = [...this._elementsArray];

      elementsArray[index] = value;

      return new KopiArray(elementsArray);
    };
  }

  get(index) {
    if (index.constructor.name === 'KopiRange') {
      return new KopiArray(this._elementsArray.slice(index.from, index.to));
    } else if (index.constructor.name === 'KopiTuple') {
      return new KopiArray(index.getFieldsArray().reduce((accum, index) => [
        ...accum,
        this._elementsArray[index],
      ], []));
    }

    return this._elementsArray[index];
  }

  emptyValue() {
    return new KopiArray();
  }

  size() {
    return this._elementsArray.length;
  }

  concat(that) {
    return new KopiArray(this._elementsArray.concat(that.toArray()._elementsArray));
  }

  append(...that) {
    return new KopiArray(this._elementsArray.concat([...that]));
  }

  ['++'](that) {
    return new KopiArray(this._elementsArray.concat(that.toArray()._elementsArray));
  }

  async join(delimiter = new KopiString('')) {
    const elementsArray = await Promise.all(this._elementsArray);

    return new KopiString(
      elementsArray.map((element) => element.getNativeString()).join(delimiter.getNativeString()),
    );
  }

  async reverse(args, scope, visitors) {
    return new KopiArray(
      [...this._elementsArray].reverse(),
    );
  }
}

module.exports = {
  default: KopiArray,
};

const { default: KopiString } = require('./KopiString');
const { default: KopiTuple } = require('./KopiTuple');
const { default: Iterable } = require('../traits/Iterable');

KopiArray.prototype.map = Iterable.prototype.map;
KopiArray.prototype.flatMap = Iterable.prototype.flatMap;
KopiArray.prototype.reduce = Iterable.prototype.reduce;
KopiArray.prototype.find = Iterable.prototype.find;
KopiArray.prototype.splitOn = Iterable.prototype.splitOn;
KopiArray.prototype.splitEvery = Iterable.prototype.splitEvery;
KopiArray.prototype.count = Iterable.prototype.count;
