import { Context, KopiValue } from '../../shared';

import KopiNumber from './KopiNumber';

import KopiIterable from '../../operators/traits/KopiIterable';

import KopiTuple from './KopiTuple';
import KopiFunction from './KopiFunction';

class KopiDict extends KopiValue {
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

  // override async force() {
  //   let elements: Promise<KopiValue>[] = [];

  //   for (const element of this.elements) {
  //     elements.push(element);
  //   }

  //   return new KopiArray(elements);
  // }

  entries: Map<any, [KopiValue, Promise<KopiValue>]>;
}

// for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
//   if (name !== 'constructor') {
//     (KopiArray.prototype as any)[name] = (KopiIterable.prototype as any)[name];
//   }
// }

for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
  if (name !== 'constructor') {
    (KopiDict.prototype as any)[name] = (KopiIterable.prototype as any)[name];
  }
}

export default KopiDict;
