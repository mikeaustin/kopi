{
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
}

{
  class KopiIterator2 {
    constructor(iterable, iter, result, index = -1) {
      this._iterable = iterable;
      this._iter = iter;
      this._index = index;
      this.value = result?.value;
      this.done = result?.done;
    }

    clone() {
      let iter = this._iterable[Symbol.iterator]();

      for (let i = 0; i < this._index; ++i) {
        iter.next();
      }

      return new KopiIterator2(this._iterable, iter, { value: this.value, done: this.done }, this._index);
    }

    next() {
      return new KopiIterator2(this._iterable, this._iter, this._iter.next(), this._index + 1);
    }
  }

  let iter = new KopiIterator2([1, 2, 3], [1, 2, 3][Symbol.iterator]());
  let iter2 = iter.clone();

  for (iter = iter.next(); !iter.done; iter = iter.next()) {
    console.log(iter);
  }

  console.log('-----');

  for (iter2 = iter2.next(); !iter2.done; iter2 = iter2.next()) {
    console.log(iter2);
  }
}

/*

Issue: Can't share an iter since it is mutable internally

*/
