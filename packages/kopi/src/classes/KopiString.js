const util = require("util");

class KopiString {
  constructor(nativeString) {
    this.nativeString = nativeString;
  }

  toString() {
    return `${this.nativeString}`;
  }

  toStringAsync() {
    return this.toString();
  };

  [util.inspect.custom]() {
    return `"${this.nativeString}"`;
  }

  *[Symbol.iterator]() {
    return this.nativeString[Symbol.iterator]();
  }

  ['=='](that) {
    // if (typeof that !== 'string') {
    //   return false;
    // }

    return this.nativeString.valueOf() === that.nativeString.valueOf();
  }

  ['!='](that) {
    return !this['=='](that);
  }

  ['++'](that) {
    // if (typeof that !== 'string') {
    //   throw new Error(`Can't concat string with ${that.constructor.name}`);
    // }

    return new KopiString(this.nativeString.concat(that.nativeString));
  }

  ['<'](that) {
    return this.nativeString < that.nativeString;
  }

  ['<='](that) {
    return this.nativeString <= that.nativeString;
  }

  length() {
    return this.nativeString.length;
  }

  succ() {
    return new KopiString(String.fromCodePoint(this.nativeString.codePointAt(0) + 1));
  }

  split(delimiter = '') {
    return this.nativeString.split(delimiter).map(element => new KopiString(element));
  }

  trim() {
    return new KopiString(this.nativeString.trim());
  }
}

module.exports = {
  default: KopiString,
};
