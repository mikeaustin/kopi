const util = require("util");
const { Map } = require('immutable');

class KopiDict {
  constructor(entries) {
    this.immutableMap = new Map(entries);
  }

  async toStringAsync() {
    const entries = await Promise.all(
      this.immutableMap.toArray().map(async ([key, value]) => (
        `${key}: ${(await value)[util.inspect.custom]()}`
      ))
    );

    return `{${entries.join(', ')}}`;
  }
}

module.exports = {
  default: KopiDict
};;
