const util = require("util");

class KopiArray {
  constructor(elements = []) {
    this.elements = elements;
  }

  toString = function () {
    return `[${this.elements.map(element => element.toString()).join(', ')}]`;
  };

  [util.inspect.custom]() {
    return `[${this.elements.map(element => inspect(element)).join(', ')}]`;
  }

  *[Symbol.iterator]() {
    return this.elements[Symbol.iterator]();
  }

  map(args, scope, visitors) {
    return Promise.all(this.elements.map((element) => (
      args.apply(undefined, [element, scope, visitors])
    )));
  }
}

module.exports = {
  default: KopiArray,
};
