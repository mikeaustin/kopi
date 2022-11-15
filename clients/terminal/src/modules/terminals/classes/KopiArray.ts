import { addTraits, KopiValue, Trait } from "../../shared";

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

  *[Symbol.iterator]() {
    for (const value of this.elements) {
      yield value;
    }
  }

  *[Symbol.asyncIterator]() {
    for (const value of this.elements) {
      yield value;
    }
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  override async force() {
    let elements: Promise<KopiValue>[] = [];

    for (const element of this.elements) {
      elements.push(element);
    }

    return new KopiArray(elements);
  }

  elements: Promise<KopiValue>[];
}

addTraits([KopiIterable], KopiArray);

export default KopiArray;
