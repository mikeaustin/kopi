import KopiArray from './KopiArray.mjs';
import Iterable from '../traits/Iterable.mjs';

class KopiSequence {
  constructor(sequence) {
    this._sequence = sequence;
  }

  async inspectAsync() {
    const values = [];

    for await (const field of this._sequence) {
      values.push(field);
    }

    return new KopiArray(values).inspectAsync();
  }

  emptyValue() {
    return new KopiArray();
  }

  [Symbol.asyncIterator]() {
    return this._sequence[Symbol.asyncIterator]();
  }
}

KopiSequence.prototype.map = Iterable.prototype.map;
KopiSequence.prototype.flatMap = Iterable.prototype.flatMap;
KopiSequence.prototype.reduce = Iterable.prototype.reduce;
KopiSequence.prototype.find = Iterable.prototype.find;
KopiSequence.prototype.splitOn = Iterable.prototype.splitOn;
KopiSequence.prototype.splitEvery = Iterable.prototype.splitEvery;
KopiSequence.prototype.count = Iterable.prototype.count;

export default KopiSequence;
