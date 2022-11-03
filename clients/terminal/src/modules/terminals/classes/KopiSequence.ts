import { KopiValue, Evaluate, Environment } from '../../shared';

import KopiTuple from './KopiTuple';
import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';
import KopiBoolean from './KopiBoolean';

class KopiSequence extends KopiValue {
  constructor(sequence: AsyncIterable<KopiValue>) {
    super();

    this.sequence = sequence;
  }

  override async inspect() {
    const values: Promise<KopiValue>[] = [];

    for await (const field of this.sequence) {
      values.push(Promise.resolve(field));
    }

    return new KopiArray(values).inspect();
  }

  // emptyValue() {
  //   return new KopiArray();
  // }

  // [Symbol.iterator]() {
  //   return this.sequence[Symbol.iterator]();
  // }

  [Symbol.asyncIterator]() {
    return this.sequence[Symbol.asyncIterator]();
  }

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this.sequence) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values);
  }

  async filter(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
          yield value;
        }
      }
    })();

    return new KopiSequence(generator);
  }

  sequence: AsyncIterable<KopiValue>;
}

export default KopiSequence;
