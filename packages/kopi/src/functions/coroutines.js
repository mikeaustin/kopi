const { EventEmitter } = require('stream');

const { KopiTuple, KopiVector } = require('../classes');

const coroutineEventEmitter = new EventEmitter();

let nextCoroutineId = 0;

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

// (async () => {
//   const deferred = new Deferred();

//   deferred.resolve(15);

//   console.log(await deferred);
// })();

let coroutinePromises = {};
let coroutinePromises2 = {};

const spawn = (fn, scope, visitors) => {
  const coroutineId = nextCoroutineId++;

  coroutinePromises[coroutineId] = new Deferred();
  coroutinePromises2[coroutineId] = new Deferred();

  coroutineEventEmitter.on(coroutineId, (event) => {
    event.promise = coroutinePromises[coroutineId];

    coroutinePromises2[coroutineId].resolve(event.data);
  });

  fn.apply(undefined, [KopiTuple.empty, { ...scope, _coroutineId: coroutineId }, visitors]);

  return coroutineId;
};

const yield = async (fn, scope, visitors) => {
  const coroutineId = scope._coroutineId;

  const data = await coroutinePromises2[coroutineId];
  coroutinePromises2[coroutineId] = new Deferred();

  const value = fn.apply(undefined, [data, scope, visitors]);

  coroutinePromises[coroutineId].resolve(value);

  return value;
};

const send = (coroutineId) => async (data) => {
  return new Promise(resolve => setImmediate(async () => {
    const event = { data };
    coroutineEventEmitter.emit(coroutineId, event);

    const value = await event.promise;
    coroutinePromises[coroutineId] = new Deferred();

    resolve(value);
  }));
};

module.exports = {
  spawn,
  yield,
  send,
};
