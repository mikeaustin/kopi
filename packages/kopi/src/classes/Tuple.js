const util = require("util");

class Tuple {
  static empty = new Tuple(null);

  constructor(elements = []) {
    if (elements === null) {
      this.elements = [];

      return this;
    }

    if (elements.length === 0) {
      console.log('Use Tuple.empty instead of calling Tuple([]).');

      return Tuple.empty;
    }

    this.elements = elements;
  }

  toString() {
    if (this.elements.length === 0) {
      return '()';
    }

    return `(${this.elements.map(element => element.toString()).join(', ')})`;
  }

  [util.inspect.custom]() {
    return `(${this.elements.map(element => inspect(element)).join(', ')})`;
  }

  map(mapper, scope, visitors) {
    const iters = this.elements.map(element => element[Symbol.iterator]());
    const values = [];

    let results = iters.map(iter => iter.next());

    while (results.every(result => !result.done)) {
      values.push(
        mapper.apply(undefined, [new Tuple(results.map(result => result.value)), scope, visitors])
      );

      results = iters.map(iter => iter.next());
    }

    return Promise.all(values);
  }
}

module.exports = {
  default: Tuple,
};
