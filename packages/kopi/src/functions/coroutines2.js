const { EventEmitter } = require('stream');

const { KopiTuple, KopiVector } = require('../classes');

const coroutineEventEmitter = new EventEmitter();

let nextCoroutineId = 0;

class Deferred {
  constructor() {
    const promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
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

coroutineMap = {};

const spawn = (fn, scope, visitors) => {
  const coroutineId = nextCoroutineId++;

  coroutineMap[coroutineId] = new Deferred();

  coroutineEventEmitter.on(coroutineId, (event) => {
    console.log('1');
    event.promise = coroutineMap[coroutineId];
  });

  fn.apply(undefined, [KopiTuple.empty, { ...scope, _coroutineId: coroutineId }, visitors]);

  return coroutineId;
};

const yield = (fn, scope, visitors) => {
  const value = fn.apply(undefined, [event.data, scope, visitors]);

  coroutineMap[scope._coroutineId].resolve(value);

  return value;
  // return new Promise(resolve => {
  //   coroutineEventEmitter.once(scope._coroutineId, (event) => {
  //     event.value = fn.apply(undefined, [event.data, scope, visitors]);

  //     resolve(event.value);
  //   });
  // });
};

const send = (coroutineId) => (data) => {
  return new Promise(resolve => setImmediate(async () => {
    const event = { data };
    coroutineEventEmitter.emit(coroutineId, event);

    resolve(await event.promise);
  }));
};

module.exports = {
  spawn,
  yield,
  send,
};
