import { KopiValue } from '../../shared';
import KopiArray from './KopiArray';

class KopiSequence extends KopiValue {
  constructor(sequence: AsyncIterable<KopiValue>) {
    super();

    this.sequence = sequence;
  }

  override async inspect() {
    const values: Promise<KopiValue>[] = [];

    for await (const field of this.sequence) {
      values.push(Promise.resolve(field));
    }

    return new KopiArray(values).inspect();
  }

  // emptyValue() {
  //   return new KopiArray();
  // }

  // [Symbol.iterator]() {
  //   return this.sequence[Symbol.iterator]();
  // }

  [Symbol.asyncIterator]() {
    return this.sequence[Symbol.asyncIterator]();
  }

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this.sequence) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values);
  }

  sequence: AsyncIterable<KopiValue>;
}

export default KopiSequence;
