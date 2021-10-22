const util = require("util");

class KopiString {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }

  toStringAsync() {
    return this.toString();
  };

  [util.inspect.custom]() {
    return `"${this.value}"`;
  }

  *[Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }

  ['=='](that) {
    // if (typeof that !== 'string') {
    //   return false;
    // }

    return this.value.valueOf() === that.value.valueOf();
  }

  ['!='](that) {
    return !this['=='](that);
  }

  ['++'](that) {
    // if (typeof that !== 'string') {
    //   throw new Error(`Can't concat string with ${that.constructor.name}`);
    // }

    return new KopiString(this.value.concat(that.value));
  }

  ['<'](that) {
    return this.value < that.value;
  }

  ['<='](that) {
    return this.value <= that.value;
  }

  length() {
    return this.value.length;
  }

  succ() {
    return new KopiString(String.fromCodePoint(this.value.codePointAt(0) + 1));
  }

  split(delimiter = '') {
    return this.value.split(delimiter).map(element => new KopiString(element));
  }

  trim() {
    return new KopiString(this.value.trim());
  }
}

module.exports = {
  default: KopiString,
};
