const { KopiString } = require('../classes');

class Iterable {
  async _map(func, scope, visitors) {
    let accum = this.emptyValue();

    for (const element of this) {
      accum = accum.concat(await func.apply(undefined, [await element, scope, visitors]));
    }

    return accum;
  }

  // async *_map(func, scope, visitors) {
  //   for (const element of this) {
  //     yield await func.apply(undefined, [await element, scope, visitors]);
  //   }
  // }

  async _flatMap(func, scope, visitors) {
    let accum = this.emptyValue();

    for (const element of this) {
      const appliedElement = await func.apply(undefined, [element, scope, visitors]);

      if (appliedElement[Symbol.iterator]) {
        accum = accum.concat(appliedElement);
      } else {
        accum = accum.concat(appliedElement);
      }
    }

    return accum;
  }
}

module.exports = {
  default: Iterable
};
