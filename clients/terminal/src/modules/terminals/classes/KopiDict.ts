import { addTraits, Context, KopiValue } from '../../shared';

import KopiIterable from '../../operators/traits/KopiIterable';

import KopiTuple from './KopiTuple';
import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiBoolean from './KopiBoolean';

class KopiDict extends KopiValue {
  static empty = new KopiDict([]);

  entries: Map<any, [KopiValue, Promise<KopiValue>]>;

  constructor(entries: [key: KopiValue, value: Promise<KopiValue>][]) {
    super();

    this.entries = new Map(
      entries.map(([key, value]) => [key.valueOf(), [key, value]])
    );
  }

  override async inspect() {
    if (this.entries.size === 0) {
      return `{:}`;
    }

    const entries = await Promise.all(
      (Array.from(this.entries)).map(
        async ([key, [_, value]]) => `${key}: ${await (await value).inspect()}`
      )
    );

    return `{ ${entries.join(', ')} }`;
  }

  override async toJS() {
    return Promise.all(
      [...this.entries].map(async ([key, [_, value]]) => [key, (await value).toJS()])
    );
  }

  *[Symbol.asyncIterator]() {
    for (const [_, [key, value]] of this.entries) {
      yield new KopiTuple([Promise.resolve(key), value]);
    }
  }

  async size() {
    return new KopiNumber(this.entries.size);
  }

  async get(key: KopiValue): Promise<KopiValue> {
    const [_, value] = this.entries.get(key.valueOf()) ?? [key, new KopiTuple([])];

    return value;
  }

  set(key: KopiValue) {
    return async (value: Promise<KopiValue>): Promise<KopiDict> => {
      const foo = [...this.entries.entries()].map(
        ([key, [_, value]]) => [key, value]
      ) as [key: any, value: Promise<KopiValue>][];

      return new KopiDict(
        [...foo, [key, Promise.resolve(value)]]
      );
    };
  }

  has(key: KopiValue) {
    return new KopiBoolean(this.entries.has(key.valueOf()));
  }

  update(key: KopiValue, context: Context) {
    return async (func: KopiFunction) => {
      const [_, value] = this.entries.get(key.valueOf()) ?? [key, new KopiTuple([])];

      const updatedValue = func.apply(new KopiTuple([]), [await value, context]);

      const foo = [...this.entries.entries()].map(([key, value]) => [key, value[1]]) as
        [key: any, value: Promise<KopiValue>][];

      return new KopiDict(
        [...foo, [key, Promise.resolve(updatedValue)]]
      );
    };
  }
}

addTraits([KopiIterable], KopiDict);

export default KopiDict;
