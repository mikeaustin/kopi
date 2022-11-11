import { KopiValue } from "../../shared";

import KopiNumber from './KopiNumber';

import KopiIterable from '../../operators/traits/KopiIterable';
import KopiTuple from "./KopiTuple";

class KopiDict extends KopiValue {
  constructor(entries: [key: KopiValue, value: Promise<KopiValue>][]) {
    super();

    this.entries = new Map(entries);
  }

  override async inspect() {
    if (this.entries.size === 0) {
      return `{:}`;
    }

    const entries = await Promise.all(
      (Array.from(this.entries)).map(
        async ([key, value]: [any, Promise<KopiValue>]) => `${key}: ${await (await value).inspect()}`
      )
    );

    return `{${entries.join(', ')}}`;
  }

  *[Symbol.asyncIterator]() {
    for (const [key, value] of this.entries) {
      yield new KopiTuple([Promise.resolve(key), value]);
    }
  }

  size() {
    return new KopiNumber(this.entries.size);
  }

  // override async force() {
  //   let elements: Promise<KopiValue>[] = [];

  //   for (const element of this.elements) {
  //     elements.push(element);
  //   }

  //   return new KopiArray(elements);
  // }

  entries: Map<any, Promise<KopiValue>>;
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
