const util = require("util");

class KopiString {
  constructor(value) {
    this.value = value;
  }

  toString = function () {
    return `${this.value}`;
  };

  [util.inspect.custom]() {
    return `"${this.value}"`;
  }

  *[Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }

  succ() {
    return String.fromCodePoint(this.value.codePointAt(0) + 1);
  }
}

module.exports = {
  default: KopiString,
};
