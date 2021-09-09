const asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      async next() {
        if (this.i < 3) {
          return { value: this.i++, done: false };
        }

        return { done: true };
      }
    };
  }
};

(async function () {
  for await (let num of asyncIterable) {
    console.log(num);
  }
})();
