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
    this._immutableMap = new Map(entries);
  }

  async toStringAsync() {
    if (this._immutableMap.size === 0) {
      return `{:}`;
    }

    const entries = await Promise.all(
      this._immutableMap.toArray().map(async ([key, value]) => (
        `${inspect(key)}: ${inspect(await value)}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }

  async ['=='](that, scope, visitors) {
    if (!(that instanceof KopiDict)) {
      return false;
    }

    if (this._immutableMap.size !== that._immutableMap.size) {
      return false;
    }

    for (const [key, value] of this._immutableMap) {
      const left = await value;
      const right = await that._immutableMap.get(key);

      const result = await applyOperator('==', left, right, scope, visitors);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  async set(tuple) {
    return new KopiDict(this._immutableMap.set(tuple.getElementAtIndex(0), tuple.getElementAtIndex(1)));
  }

  async get(key) {
    const value = await this._immutableMap.get(key);

    if (value === undefined) {
      return KopiTuple.empty;
    }

    return value;
  }

  async update(key) {
    return (func, scope, visitors) => {
      const entries = this._immutableMap.update(key, (value) => (
        func.apply(undefined, [value ?? KopiTuple.empty, scope, visitors]))
      );

      return new KopiDict(entries);
    };
  }

  async map(func, scope, visitors) {
    let values = new Map();

    for (let [key, value] of this._immutableMap) {
      values = this._immutableMap.set(
        key,
        func.apply(undefined, [new KopiTuple([key, await value]), scope, visitors])
      );
    }

    return new KopiDict(values);
  }

  async reduce(tuple, scope, visitors) {
    const [_func, init] = tuple.getElementsArray();

    const func = await _func;
    let accum = await init;

    for (const [key, value] of this._immutableMap) {
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
