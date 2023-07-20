import { addTraits, KopiCollection, KopiValue } from '../../shared.js';

import KopiIterable from '../traits/KopiIterable.js';

import KopiArray from './KopiArray.js';
import KopiString from './KopiString.js';

const KopiStream2 = (collection: KopiCollection) => {
  class KopiStream extends KopiValue {
    static readonly emptyValue = () => new KopiString('');

    readonly iterable: AsyncIterable<KopiValue>;

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
  }

  addTraits([KopiIterable, KopiCollection], KopiStream);

  return KopiStream;
};

class KopiStream extends KopiValue {
  static readonly emptyValue = () => new KopiString('');

  readonly iterable: AsyncIterable<KopiValue>;

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
}

addTraits([KopiIterable, KopiCollection], KopiStream);

export default KopiStream;

export {
  KopiStream2
};
