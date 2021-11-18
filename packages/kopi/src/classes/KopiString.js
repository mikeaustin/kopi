class KopiString {
  constructor(nativeString) {
    this._nativeString = nativeString;
  }

  getNativeString() {
    return this._nativeString;
  }

  inspectAsync() {
    return `"${this._nativeString}"`;
  }

  toStringAsync() {
    return this._nativeString;
  }

  *[Symbol.iterator]() {
    for (const c of this._nativeString) {
      yield new KopiString(c);
    }
  }

  size() {
    return this._nativeString.length;
  }

  emptyValue() {
    return new KopiString('');
  }

  valueOf() {
    return this._nativeString;
  }

  apply(thisArg, [that]) {
    return this['++'](that);
  }

  append(that) {
    return new KopiString(this._nativeString.concat([that._nativeString]));
  }

  get(index) {
    if (index.constructor.name === 'KopiRange') {
      return new KopiString(this._nativeString.slice(index.from, index.to));
    }

    return new KopiString(this._nativeString[index]);
  }

  fromCodePoint(number) {
    return new KopiString(String.fromCodePoint(number));
  }

  codePointAt(index) {
    return this._nativeString.codePointAt(index);
  }

  toUpper() {
    return new KopiString(this._nativeString.toUpperCase());
  }

  ['=='](that) {
    // if (typeof that !== 'string') {
    //   return false;
    // }

    return this._nativeString.valueOf() === that._nativeString.valueOf();
  }

  ['!='](that) {
    return !this['=='](that);
  }

  async ['++'](that) {
    // if (typeof that !== 'string') {
    //   throw new Error(`Can't concat string with ${that.constructor.name}`);
    // }

    return new KopiString(this._nativeString.concat(await that.toStringAsync()));
  }

  concat(that) {
    return new KopiString(this._nativeString.concat(that._nativeString));
  }

  ['<'](that) {
    return this._nativeString < that._nativeString;
  }

  ['<='](that) {
    return this._nativeString <= that._nativeString;
  }

  length() {
    return this._nativeString.length;
  }

  succ(count = 1) {
    return new KopiString(String.fromCodePoint(this._nativeString.codePointAt(0) + count));
  }

  split(delimiter = new KopiString('')) {
    return new KopiArray(
      this._nativeString.split(delimiter.getNativeString()).map((element) => new KopiString(element)),
    );
  }

  trim() {
    return new KopiString(this._nativeString.trim());
  }
}

module.exports = {
  default: KopiString,
};

const { default: KopiArray } = require('./KopiArray');
