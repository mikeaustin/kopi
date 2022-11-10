import { KopiValue } from "../../shared";

import KopiNumber from './KopiNumber';

import KopiIterable from '../../operators/traits/KopiIterable';

class KopiMap extends KopiValue {
  constructor(entries: [key: KopiValue, value: Promise<KopiValue>][]) {
    super();

    this.entries = new Map(entries);
  }

  // override async inspect() {
  //   const elements = await Promise.all(
  //     this.entries.map(async element => (await element).inspect())
  //   );

  //   return `[${elements.join(', ')}]`;
  // }

  // *[Symbol.asyncIterator]() {
  //   for (const value of this.elements) {
  //     yield value;
  //   }
  // }

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

  entries: Map<KopiValue, Promise<KopiValue>>;
}

// for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
//   if (name !== 'constructor') {
//     (KopiArray.prototype as any)[name] = (KopiIterable.prototype as any)[name];
//   }
// }

export default KopiMap;
