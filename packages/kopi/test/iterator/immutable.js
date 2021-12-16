class KopiIterator {
  constructor(iter) {
    this._iter = iter;

    const result = iter.next();

    this.value = result.value;
    this.done = result.done;
  }

  next() {
    return new KopiIterator(this._iter);
  }
}

let iter = new KopiIterator([1, 2, 3][Symbol.iterator]());

for (let iter = new KopiIterator([1, 2, 3][Symbol.iterator]()); !iter.done; iter = iter.next()) {
  console.log(iter);
}
