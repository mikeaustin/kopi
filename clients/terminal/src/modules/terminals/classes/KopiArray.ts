import { KopiValue } from "../../shared";
import { Numeric, Equatable, Enumerable } from "../../shared";

import KopiNumber from './KopiNumber';

import KopiIterable from '../../operators/traits/KopiIterable';

class KopiArray extends KopiValue {
  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  override async force() {
    let elements: Promise<KopiValue>[] = [];

    for (const element of this.elements) {
      console.log(element);
      elements.push(element);
    }

    return new KopiArray(elements);
  }

  elements: Promise<KopiValue>[];
}

for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
  if (name !== 'constructor') {
    (KopiArray.prototype as any)[name] = (KopiArray.prototype as any)[name];
  }
}

export default KopiArray;
