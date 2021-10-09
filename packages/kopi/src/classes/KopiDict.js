const util = require("util");
const { Map } = require('immutable');

const { default: KopiTuple } = require('./KopiTuple');

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

  async get(key) {
    return await this.entries.get(key);
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
      values = this.entries.set(key, func.apply(undefined, [new KopiTuple([key, await value]), scope, visitors]));
    }

    return values;
  }
}

module.exports = {
  default: KopiDict
};;
