const util = require("util");
const { Map } = require('immutable');

const { default: KopiTuple } = require('./KopiTuple');
const { applyOperator } = require('../utils');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiDict {
  constructor(entries) {
    this.entries = new Map(entries);
  }

  async toStringAsync() {
    if (this.entries.size === 0) {
      return `{:}`;
    }

    const entries = await Promise.all(
      this.entries.toArray().map(async ([key, value]) => (
        `${inspect(key)}: ${inspect(await value)}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }

  async ['=='](that, scope, visitors) {
    if (!(that instanceof KopiDict)) {
      return false;
    }

    if (this.entries.size !== that.entries.size) {
      return false;
    }

    for (const [key, value] of this.entries) {
      const left = await value;
      const right = await that.entries.get(key);

      const result = await applyOperator('==', left, right, scope, visitors);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  async set(tuple) {
    return new KopiDict(this.entries.set(tuple.elements[0], tuple.elements[1]));
  }

  async get(key) {
    const value = await this.entries.get(key);

    if (value === undefined) {
      return KopiTuple.empty;
    }

    return value;
  }

  async update({ elements: [key, _func] }, scope, visitors) {
    const func = await _func;

    const entries = this.entries.update(key, value => (
      func.apply(undefined, [value ?? KopiTuple.empty, scope, visitors])
    ));

    return new KopiDict(entries);
  }

  async updatex(key) {
    console.log('here 1');
    return (func, scope, visitors) => {
      console.log('here 2');
      return 0;
      // return this.entries.update(key, (value = 0) => func.apply(undefined, [value, scope, visitors]));
    };
  }

  async map(func, scope, visitors) {
    let values = new Map();

    for (let [key, value] of this.entries) {
      values = this.entries.set(
        key,
        func.apply(undefined, [new KopiTuple([key, await value]), scope, visitors])
      );
    }

    return new KopiDict(values);
  }

  async _reduce({ elements: [_func, init] }, scope, visitors) {
    const func = await _func;
    let accum = await init;

    for (const [key, value] of this.entries) {
      accum = await func.apply(
        undefined,
        [
          new KopiTuple([
            accum,
            new KopiTuple([key, value])
          ]),
          scope,
          visitors
        ]
      );
    }

    return accum;
  };
}

module.exports = {
  default: KopiDict
};;
