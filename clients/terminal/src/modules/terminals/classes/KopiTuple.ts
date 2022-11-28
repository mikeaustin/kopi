import { Context, KopiValue } from '../../shared';
import KopiBoolean from './KopiBoolean';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';
import KopiStream from './KopiStream';

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([], [], true);

  readonly _fields: Promise<KopiValue>[];
  readonly fieldNames: (string | null)[];

  static create(tuple: KopiTuple) {
    return new KopiTuple(tuple._fields, tuple.fieldNames);
  }

  constructor(fields: Promise<KopiValue>[], fieldNames?: (string | null)[], isEmpty = false) {
    super();

    if (fields.length === 0 && !isEmpty) {
      this._fields = [];
      this.fieldNames = [];

      return KopiTuple.empty;
    }

    this._fields = fields;
    this.fieldNames = fieldNames ?? Array.from(fields, (_) => null);

    this.fieldNames.forEach((fieldName, index) => {
      (this as any)[index] = fields[index];

      if (fieldName !== null) {
        (this as any)[fieldName] = fields[index];
      }
    });
  }

  override get fields() {
    return this._fields;
  }

  override async toString() {
    const fields = await Promise.all(
      this._fields.map(async (element, index) =>
        this.fieldNames[index] !== null ? `${this.fieldNames[index]}: ` : `` +
          `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }

  override async inspect() {
    return this.toString();
  }

  async '=='(that: KopiTuple, context: Context): Promise<KopiBoolean> {
    if (that._fields.length !== this._fields.length) {
      return new KopiBoolean(false);
    }

    for (const [index, thatValue] of that._fields.entries()) {
      const thisValue = this._fields[index];

      if (thisValue === undefined) {
        return new KopiBoolean(false);
      }

      if (!(await (await thatValue).invoke('==', [await thisValue, context]) as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }

  map(func: KopiFunction, context: Context) {
    const result = (async function* map(this: KopiTuple) {
      const iters = await Promise.all(
        this._fields.map(
          async (element) => (await element as unknown as AsyncIterable<KopiValue>)[Symbol.asyncIterator]()
        )
      );

      let results = await Promise.all(iters.map((iter) => iter.next()));

      while (results.every((result) => !result.done)) {
        yield func.apply(KopiTuple.empty, [new KopiTuple(results.map((result) => result.value)), context]);

        results = await Promise.all(iters.map((iter) => iter.next()));
      }
    }).apply(this);

    return new KopiStream(result);
  }

  async reduce(func: KopiFunction, context: Context) {
    let accum: KopiValue = KopiTuple.empty;

    const iters = await Promise.all(
      this._fields.map(
        async (element) => (await element as unknown as AsyncIterable<KopiValue>)[Symbol.asyncIterator]()
      )
    );

    let results = await Promise.all(iters.map((iter) => iter.next()));

    while (results.every((result) => !result.done)) {
      accum = await func.apply(KopiTuple.empty, [new KopiTuple([accum, ...results.map((result) => result.value)]), context]);

      results = await Promise.all(iters.map((iter) => iter.next()));
    }

    return accum;
  }
}

export default KopiTuple;
