import KopiTuple from '../classes/KopiTuple.mjs';
import KopiArray from '../classes/KopiArray.mjs';

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
    let accum = this.emptyValue?.();

    if (!(accum?.append)) {
      throw new Error('Type using Iterable trait is missing emptyValue() or value append() method');
    }

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

  async splitOn(delimiter) {
    const delimiterRexExp = new RegExp(delimiter.valueOf());
    const accum = [];

    let values = this.emptyValue();

    for await (const element of this) {
      // if (delimiterRexExp.test(element.valueOf())) {
      if (element.valueOf() === delimiter) {
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

const map = (thisArg) => (args, scope, visitors) => Iterable.prototype.map.apply(thisArg, [args, scope, visitors]);
const flatMap = (thisArg) => (args, scope, visitors) => Iterable.prototype.flatMap.apply(thisArg, [args, scope, visitors]);
const reduce = (thisArg) => (args, scope, visitors) => Iterable.prototype.reduce.apply(thisArg, [args, scope, visitors]);
const find = (thisArg) => (args, scope, visitors) => Iterable.prototype.find.apply(thisArg, [args, scope, visitors]);
const splitOn = (thisArg) => (args, scope, visitors) => Iterable.prototype.splitOn.apply(thisArg, [args, scope, visitors]);
const splitEvery = (thisArg) => (args, scope, visitors) => Iterable.prototype.splitEvery.apply(thisArg, [args, scope, visitors]);
const count = (thisArg) => (args, scope, visitors) => Iterable.prototype.splitEvery.count(thisArg, [args, scope, visitors]);

export default Iterable;

export {
  map,
  flatMap,
  reduce,
  find,
  splitOn,
  splitEvery,
  count,
};
