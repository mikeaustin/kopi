import { KopiValue, Evaluate, Environment } from '../../shared';

import KopiIterable from '../../operators/traits/KopiIterable';

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

  iterable: AsyncIterable<KopiValue>;
}

for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
  if (name !== 'constructor') {
    (KopiStream.prototype as any)[name] = (KopiIterable.prototype as any)[name];
  }
}

export default KopiStream;
