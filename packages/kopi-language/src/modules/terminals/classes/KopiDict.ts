import { addTraits, Context, KopiValue } from '../../shared';

import KopiIterable from '../traits/KopiIterable';

import KopiTuple from './KopiTuple';
import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiBoolean from './KopiBoolean';

class KopiDict extends KopiValue {
  static readonly empty = new KopiDict([]);

  readonly entries: Map<any, [KopiValue, Promise<KopiValue>]>;

  constructor(entries: [key: KopiValue, value: Promise<KopiValue>][]) {
    super();

    this.entries = new Map(
      entries.map(([key, value]) => [key.valueOf(), [key, value]])
    );
  }

  override async toString() {
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

  override async inspect() {
    return this.toString();
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
    const [_, value] = this.entries.get(key.valueOf()) ?? [key, KopiTuple.empty];

    return value;
  }

  set(key: KopiValue) {
    return async (value: Promise<KopiValue>): Promise<KopiDict> => {
      const map = new Map(this.entries);

      map.set(key.valueOf(), [key, Promise.resolve(value)]);

      return new KopiDict(
        [...map.entries()].map(([_, [key, value]]) => [key, value])
      );
    };
  }

  delete(key: KopiValue) {
    const map = new Map(this.entries);

    map.delete(key.valueOf());

    return new KopiDict(
      [...map.entries()].map(([_, [key, value]]) => [key, value])
    );
  }

  has(key: KopiValue) {
    return new KopiBoolean(this.entries.has(key.valueOf()));
  }

  merge(that: KopiDict) {
    const map = new Map([...this.entries, ...that.entries]);

    return new KopiDict(
      [...map.entries()].map(([_, [key, value]]) => [key, value])
    );
  }

  update(key: KopiValue, context: Context) {
    return async (func: KopiFunction) => {
      const [_, value] = this.entries.get(key.valueOf()) ?? [key, KopiTuple.empty];
      const updatedValue = func.apply(KopiTuple.empty, [await value, context]);

      const map = new Map(this.entries);

      map.set(key.valueOf(), [key, Promise.resolve(updatedValue)]);

      return new KopiDict(
        [...map.entries()].map(([_, [key, value]]) => [key, value])
      );
    };
  }
}

addTraits([KopiIterable], KopiDict);

export default KopiDict;
