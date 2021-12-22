class Deferred {
  constructor() {
    const promise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject, Math.pow(2, 32) / 2 - 1);

      this.resolve = (value) => {
        clearTimeout(timeoutId);

        resolve(value);
      };

      this.reject = reject;
    });

    promise.resolve = this.resolve;
    promise.reject = this.reject;

    return promise;
  }
}

const range = async function* (from, to) {
  for (let i = from; i < to; i++) {
    yield new Promise((resolve) => {
      setTimeout(function () {
        resolve(i);
      }, 100);
    });
  }
};

const timer = async function* () {
  let deferred = new Deferred();

  setInterval(() => {
    deferred.resolve(Date.now());

    deferred = new Deferred();
  }, 1000);

  for (; ;) {
    yield deferred;
  }
};

const filter = (func) => async function* (iterable) {
  for await (const value of iterable) {
    console.log('filter', value);

    if (func(value)) {
      yield value;
    }
  }
};

const map = (func) => async function* (iterable) {
  for await (const value of iterable) {
    console.log('map', value);

    yield func(value);
  }
};

const main = async () => {
  const stream = (
    map((x) => x / 1000)(
      filter((x) => x % 2 === 0)(
        // range(1, 10),
        timer(),
      ),
    )
  );

  for await (const value of stream) {
    console.log('=', value);
  }
};

main();
