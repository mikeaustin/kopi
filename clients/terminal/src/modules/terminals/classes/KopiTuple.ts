import { Environment, Evaluate, KopiValue } from "../../shared";
import { Numeric, Equatable, Enumerable } from "../../shared";

import KopiFunction from "./KopiFunction";
import KopiNumber from './KopiNumber';
import KopiSequence from "./KopiSequence";

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

  async size() {
    return new KopiNumber(this.elements.length);
  }

  map(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    const result = (async function* map(this: KopiTuple) {
      const iters = await Promise.all(
        this.elements.map(async (element) => (await element as unknown as AsyncIterable<KopiValue>)[Symbol.asyncIterator]())
      );

      let results = await Promise.all(iters.map((iter) => iter.next()));

      while (results.every((result) => !result.done)) {
        yield func.apply(new KopiTuple([]), [new KopiTuple(results.map((result) => result.value)), evaluate, environment]);

        results = await Promise.all(iters.map((iter) => iter.next()));
      }
    }).apply(this);

    return new KopiSequence(result);
  }

  elements: Promise<KopiValue>[];
}

export default KopiTuple;
