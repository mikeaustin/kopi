const { default: KopiString } = require('../classes/KopiString');
const { default: KopiTuple } = require('../classes/KopiTuple');

class Iterable {
  async map(func, scope, visitors) {
    let accum = this.emptyValue();

    for await (const element of this) {
      accum = accum.concat(await func.apply(undefined, [element, scope, visitors]));
    }

    return accum;
  }

  // async *map(func, scope, visitors) {
  //   for (const element of this) {
  //     yield await func.apply(undefined, [await element, scope, visitors]);
  //   }
  // }

  async flatMap(func, scope, visitors) {
    let accum = this.emptyValue();

    for await (const element of this) {
      const appliedElement = await func.apply(undefined, [element, scope, visitors]);

      if (appliedElement[Symbol.iterator]) {
        accum = accum.concat(appliedElement);
      } else {
        accum = accum.concat(appliedElement);
      }
    }

    return accum;
  }

  reduce(init) {
    return async (func, scope, visitors) => {
      let accum = init;
      let index = 0;

      for await (const element of this) {
        accum = await func.apply(undefined, [new KopiTuple([accum, element, index++]), scope, visitors]);
      }

      return accum;
    };
  }

  splitOn(delimiter = new KopiString('')) {
    const delimiterRexExp = new RegExp(delimiter.valueOf());
    const accum = [];
    let values = [];

    for await (const element of this) {
      if (delimiterRexExp.test(element.valueOf())) {
        if (values.length > 0) {
          accum.push(values);
        }

        values = [];
      } else {
        values.push(element);
      }
    }

    if (values.length !== 0) {
      accum.push(values);
    }

    return accum;
  }
  
  splitEvery(count) {
    const accum = [];
    let values = []
    
    for await (const element of this) {
      if (index % count === 0) {
        accum.push(values);
      } else {
        values.push(element);
      }
    }
    
    if (valies.length !== 0) {
      accum.push(values);
    }
    
    return accum;
}

module.exports = {
  default: Iterable,
};
