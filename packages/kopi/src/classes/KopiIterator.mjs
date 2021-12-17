import KopiTuple from './KopiTuple.mjs';

class KopiIterator {
  constructor(iter, result = { value: KopiTuple.empty, done: false }) {
    this._iter = iter;
    this.value = result.value;
    this.done = result?.done;
  }

  next() {
    return new KopiIterator(this._iter, this._iter.next());
  }
}

export default KopiIterator;
