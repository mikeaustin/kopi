import { addTraits, KopiValue, KopiMonoid } from "../../shared";

import KopiNumber from './KopiNumber';

import KopiIterable from '../../operators/traits/KopiIterable';

class KopiArray extends KopiValue {
  static emptyValue = () => new KopiArray([]);

  elements: Promise<KopiValue>[];

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

  override async toJS() {
    return Promise.all(
      this.elements.map(async element => (await element).toJS())
    );
  }

  // TODO: This is not really async, but useful when you don't care about the value
  *[Symbol.asyncIterator]() {
    for (const value of this.elements) {
      yield value;
    }
  }

  append(that: KopiValue) {
    return new KopiArray(this.elements.concat([Promise.resolve(that)]));
  }

  size() {
    return new KopiNumber(this.elements.length);
  }
}

addTraits([KopiIterable, KopiMonoid], KopiArray);

export default KopiArray;
