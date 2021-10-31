const { KopiString } = require('../classes');

class Iterable {
  async _map(func, scope, visitors) {
    let accum = [];

    for (const element of this) {
      accum.push(await func.apply(undefined, [await element, scope, visitors]));
    }

    return accum;
  }

  // async *_map(func, scope, visitors) {
  //   for (const element of this) {
  //     yield await func.apply(undefined, [await element, scope, visitors]);
  //   }
  // }
}

module.exports = {
  default: Iterable
};
