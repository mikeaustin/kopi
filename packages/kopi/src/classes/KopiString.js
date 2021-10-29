const util = require("util");

class KopiString {
  constructor(nativeString) {
    this._nativeString = nativeString;
  }

  getNativeString() {
    return this._nativeString;
  }

  inspectAsync() {
    return `"${this._nativeString}"`;
  };

  toStringAsync() {
    return this._nativeString;
  };

  *[Symbol.iterator]() {
    return this._nativeString[Symbol.iterator]();
  }

  valueOf() {
    return this._nativeString;
  }

  _get(index) {
    if (index.constructor.name === 'KopiRange') {
      return new KopiString(this._nativeString.slice(index.from, index.to));
    }

    return new KopiString(this._nativeString[index]);
  };

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

  ['++'](that) {
    // if (typeof that !== 'string') {
    //   throw new Error(`Can't concat string with ${that.constructor.name}`);
    // }

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

  succ() {
    return new KopiString(String.fromCodePoint(this._nativeString.codePointAt(0) + 1));
  }

  split(delimiter = new KopiString('')) {
    return this._nativeString.split(delimiter.getNativeString()).map(element => new KopiString(element));
  }

  trim() {
    return new KopiString(this._nativeString.trim());
  }
}

module.exports = {
  default: KopiString,
};
