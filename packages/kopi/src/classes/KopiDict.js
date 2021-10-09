const util = require("util");
const { Map } = require('immutable');

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
        `${key}: ${inspect(await value)}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }
}

module.exports = {
  default: KopiDict
};;
