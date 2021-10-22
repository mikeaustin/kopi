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
    this.immutableMap = new Map(entries);
  }

  async toStringAsync() {
    if (this.immutableMap.size === 0) {
      return `{:}`;
    }

    const entries = await Promise.all(
      this.immutableMap.toArray().map(async ([key, value]) => (
        `${inspect(key)}: ${inspect(await value)}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }

  async ['=='](that, scope, visitors) {
    if (!(that instanceof KopiDict)) {
      return false;
    }

    if (this.immutableMap.size !== that.immutableMap.size) {
      return false;
    }

    for (const [key, value] of this.immutableMap) {
      const left = await value;
      const right = await that.immutableMap.get(key);

      const result = await applyOperator('==', left, right, scope, visitors);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  async set(tuple) {
    return new KopiDict(this.immutableMap.set(tuple.elementsArray[0], tuple.elementsArray[1]));
  }

  async get(key) {
    const value = await this.immutableMap.get(key);

    if (value === undefined) {
      return KopiTuple.empty;
    }

    return value;
  }

  async update(key) {
    return (func, scope, visitors) => {
      const entries = this.immutableMap.update(key, (value) => (
        func.apply(undefined, [value ?? KopiTuple.empty, scope, visitors]))
      );

      return new KopiDict(entries);
    };
  }

  async map(func, scope, visitors) {
    let values = new Map();

    for (let [key, value] of this.immutableMap) {
      values = this.immutableMap.set(
        key,
        func.apply(undefined, [new KopiTuple([key, await value]), scope, visitors])
      );
    }

    return new KopiDict(values);
  }

  async reduce({ elementsArray: [_func, init] }, scope, visitors) {
    const func = await _func;
    let accum = await init;

    for (const [key, value] of this.immutableMap) {
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
