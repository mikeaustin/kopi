import { KopiValue } from "../../shared";
import { Numeric, Equatable, Enumerable } from "../../shared";

import KopiNumber from './KopiNumber';

class KopiTuple extends KopiValue {
  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `(${elements.join(', ')})`;
  }

  override async getElementAtIndex(index: number): Promise<KopiValue | undefined> {
    return this.elements[index];
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  elements: Promise<KopiValue>[];
}

export default KopiTuple;
