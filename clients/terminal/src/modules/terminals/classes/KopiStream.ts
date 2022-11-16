import { addTraits, KopiValue } from '../../shared';

import KopiIterable from '../../operators/traits/KopiIterable';

import KopiArray from './KopiArray';

class KopiStream extends KopiValue {
  constructor(iterable: AsyncIterable<KopiValue>) {
    super();

    this.iterable = iterable;
  }

  override async inspect() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this.iterable) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values).inspect();
  }

  // emptyValue() {
  //   return new KopiArray();
  // }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  iterable: AsyncIterable<KopiValue>;
}

for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
  if (name !== 'constructor') {
    (KopiStream.prototype as any)[name] = (KopiIterable.prototype as any)[name];
  }
}

addTraits([KopiIterable], KopiStream);

export default KopiStream;
