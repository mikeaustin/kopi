import { addTraits, KopiMonoid, KopiValue } from '../../shared';

import KopiIterable from '../../operators/traits/KopiIterable';

import KopiArray from './KopiArray';
import KopiString from './KopiString';

const KopiStream2 = (collection: KopiMonoid) => {
  class KopiStream extends KopiValue {
    static emptyValue = () => new KopiString('');

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

    [Symbol.asyncIterator]() {
      return this.iterable[Symbol.asyncIterator]();
    }

    iterable: AsyncIterable<KopiValue>;
  }

  addTraits([KopiIterable, KopiMonoid], KopiStream);

  return KopiStream;
};

class KopiStream extends KopiValue {
  static emptyValue = () => new KopiString('');

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

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  iterable: AsyncIterable<KopiValue>;
}

addTraits([KopiIterable, KopiMonoid], KopiStream);

export default KopiStream;

export {
  KopiStream2
};
