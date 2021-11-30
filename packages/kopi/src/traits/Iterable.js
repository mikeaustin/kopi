const { default: KopiString } = require('../classes/KopiString');
const { default: KopiTuple } = require('../classes/KopiTuple');
const { default: KopiArray } = require('../classes/KopiArray');

class Iterable {
  async each(func, scope, visitors) {
    for await (const element of this) {
      const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
        ...scope,
        ...await func.params.getMatches(await element),
      }));

      if (predicatePassed) {
        await func.apply(undefined, [await element, scope, visitors]);
      }
    }

    return KopiTuple.empty;
  }

  async map(func, scope, visitors) {
    let accum = this.emptyValue();

    for await (const element of this) {
      const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
        ...scope,
        ...await func.params.getMatches(element),
      }));

      if (predicatePassed) {
        accum = accum.append(await func.apply(undefined, [await element, scope, visitors]));
      }
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
        accum = accum.append(...appliedElement);
      } else {
        accum = accum.append(appliedElement);
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

  async reduce2(func, scope, visitors) {
    let accum = KopiTuple.empty;
    let index = 0;

    for await (const element of this) {
      accum = await func.apply(undefined, [new KopiTuple([accum, element, index++]), scope, visitors]);
    }

    return accum;
  }

  async find(func, scope, visitors) {
    for await (const element of this) {
      if (await func.apply(undefined, [element, scope, visitors])) {
        return element;
      }
    }

    return KopiTuple.empty;
  }

  async splitOn(delimiter = new KopiString('')) {
    const delimiterRexExp = new RegExp(delimiter.valueOf());
    const accum = [];

    let values = this.emptyValue();

    for await (const element of this) {
      if (delimiterRexExp.test(element.valueOf())) {
        if (values.size() > 0) {
          accum.push(values);
        }

        values = this.emptyValue();
      } else {
        values = values.append(element);
      }
    }

    if (values.size() !== 0) {
      accum.push(values);
    }

    return new KopiArray(accum);
  }

  async splitEvery(count) {
    const accum = [];

    let values = this.emptyValue();
    let index = 0;

    for await (const element of this) {
      if (values.size() > 0 && index % count === 0) {
        accum.push(values);

        values = this.emptyValue();
      }

      values = values.append(element);
      index += 1;
    }

    if (values.length !== 0) {
      accum.push(values);
    }

    return new KopiArray(accum);
  }

  async *chunk(count) {
    let values = this.emptyValue();
    let index = 0;

    for await (const element of this) {
      if (values.size() > 0 && index % count === 0) {
        yield values;

        values = this.emptyValue();
      }

      values = values.append(element);
      index += 1;
    }

    if (values.length !== 0) {
      yield values;
    }
  }

  async count(func = (value) => true, scope, visitors) {
    let accum = 0;

    for await (const element of this) {
      if (await func.apply(undefined, [element, scope, visitors])) {
        accum += 1;
      }
    }

    return accum;
  }
}


module.exports = {
  default: Iterable,
  map: (thisArg) => (args, scope, visitors) => Iterable.prototype.map.apply(thisArg, [args, scope, visitors]),
  flatMap: (thisArg) => (args, scope, visitors) => Iterable.prototype.flatMap.apply(thisArg, [args, scope, visitors]),
  reduce: (thisArg) => (args, scope, visitors) => Iterable.prototype.reduce.apply(thisArg, [args, scope, visitors]),
  find: (thisArg) => (args, scope, visitors) => Iterable.prototype.find.apply(thisArg, [args, scope, visitors]),
  splitOn: (thisArg) => (args, scope, visitors) => Iterable.prototype.splitOn.apply(thisArg, [args, scope, visitors]),
  splitEvery: (thisArg) => (args, scope, visitors) => Iterable.prototype.splitEvery.apply(thisArg, [args, scope, visitors]),
  count: (thisArg) => (args, scope, visitors) => Iterable.prototype.splitEvery.count(thisArg, [args, scope, visitors]),
};
