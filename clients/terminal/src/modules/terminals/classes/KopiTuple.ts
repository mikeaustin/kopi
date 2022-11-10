import { BindValues, Context, Environment, Evaluate, KopiValue } from '../../shared';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';
import KopiStream from './KopiStream';

class KopiTuple extends KopiValue {
  constructor(elements: Promise<KopiValue>[], fieldNames?: string[]) {
    super();

    this.elements = elements;
    this.fieldNames = fieldNames ?? Array.from(elements, (_) => null);

    this.fieldNames.forEach((fieldName, index) => {
      (this as any)[index] = elements[index];

      if (fieldName !== null) {
        (this as any)[fieldName] = elements[index];
      }
    });
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async (element, index) =>
        `${this.fieldNames[index] !== null ? `${this.fieldNames[index]}: ` : ``}${await (await element).inspect()}`)
    );

    return `(${elements.join(', ')})`;
  }

  override async getElementAtIndex(index: number): Promise<KopiValue | undefined> {
    return this.elements[index];
  }

  async size() {
    return new KopiNumber(this.elements.length);
  }

  map(func: KopiFunction, context: Context) {
    const result = (async function* map(this: KopiTuple) {
      const iters = await Promise.all(
        this.elements.map(async (element) => (await element as unknown as AsyncIterable<KopiValue>)[Symbol.asyncIterator]())
      );

      let results = await Promise.all(iters.map((iter) => iter.next()));

      while (results.every((result) => !result.done)) {
        yield func.apply(new KopiTuple([]), [new KopiTuple(results.map((result) => result.value)), context]);

        results = await Promise.all(iters.map((iter) => iter.next()));
      }
    }).apply(this);

    return new KopiStream(result);
  }

  elements: Promise<KopiValue>[];
  fieldNames: (string | null)[];
}

export default KopiTuple;
