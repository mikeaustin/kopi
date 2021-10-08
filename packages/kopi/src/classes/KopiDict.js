const util = require("util");
const { Map } = require('immutable');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class KopiDict {
  constructor(entries) {
    this.immutableMap = new Map(entries);
  }

  async toStringAsync() {
    const entries = await Promise.all(
      this.immutableMap.toArray().map(async ([key, value]) => (
        `${key}: ${inspect(await value)}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }
}

module.exports = {
  default: KopiDict
};;
