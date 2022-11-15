import { BindValues, Context, Environment, Evaluate, KopiValue } from '../../shared';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';
import KopiStream from './KopiStream';

class KopiTuple extends KopiValue {
  static empty = new KopiTuple([], [], true);

  static create(tuple: KopiTuple) {
    return new KopiTuple(tuple.fields, tuple.fieldNames);
  }

  constructor(fields: Promise<KopiValue>[], fieldNames?: (string | null)[], isEmpty = false) {
    super();

    if (fields.length === 0 && !isEmpty) {
      this.fields = [];
      this.fieldNames = [];

      return KopiTuple.empty;
    }

    this.fields = fields;
    this.fieldNames = fieldNames ?? Array.from(fields, (_) => null);

    this.fieldNames.forEach((fieldName, index) => {
      (this as any)[index] = fields[index];

      if (fieldName !== null) {
        (this as any)[fieldName] = fields[index];
      }
    });
  }

  override async inspect() {
    const fields = await Promise.all(
      this.fields.map(async (element, index) =>
        this.fieldNames[index] !== null ? `${this.fieldNames[index]}: ` : `` +
          `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }

  override getFieldAt(index: number): Promise<KopiValue> | undefined {
    return this.fields[index];
  }

  async size() {
    return new KopiNumber(this.fields.length);
  }

  map(func: KopiFunction, context: Context) {
    const result = (async function* map(this: KopiTuple) {
      const iters = await Promise.all(
        this.fields.map(
          async (element) => (await element as unknown as AsyncIterable<KopiValue>)[Symbol.asyncIterator]()
        )
      );

      let results = await Promise.all(iters.map((iter) => iter.next()));

      while (results.every((result) => !result.done)) {
        yield func.apply(new KopiTuple([]), [new KopiTuple(results.map((result) => result.value)), context]);

        results = await Promise.all(iters.map((iter) => iter.next()));
      }
    }).apply(this);

    return new KopiStream(result);
  }

  fields: Promise<KopiValue>[];
  fieldNames: (string | null)[];
}

export default KopiTuple;
