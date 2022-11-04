import { KopiValue, Evaluate, Environment } from '../../shared';

import KopiTuple from './KopiTuple';
import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';
import KopiBoolean from './KopiBoolean';
import KopiNumber from './KopiNumber';

class KopiStream extends KopiValue {
  constructor(iterable: AsyncIterable<KopiValue>) {
    super();

    this.iterable = iterable;
  }

  override async inspect() {
    const values: Promise<KopiValue>[] = [];

    for await (const field of this.iterable) {
      values.push(Promise.resolve(field));
    }

    return new KopiArray(values).inspect();
  }

  // emptyValue() {
  //   return new KopiArray();
  // }

  // [Symbol.iterator]() {
  //   return this.iterable[Symbol.iterator]();
  // }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this.iterable) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values);
  }

  filter(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
          yield value;
        }
      }
    })();

    return new KopiStream(generator);
  }

  take(count: KopiNumber) {
    const _this = this;

    let index = 0;

    const generator = (async function* () {
      for await (const value of _this) {
        if (index++ < count.value) {
          yield value;
        } else {
          break;
        }
      }

      return;
    })();

    return new KopiStream(generator);
  }

  iterable: AsyncIterable<KopiValue>;
}

export default KopiStream;
