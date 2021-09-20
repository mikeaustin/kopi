const { EventEmitter } = require('stream');

const { KopiTuple } = require('../classes');

const coroutineEventEmitter = new EventEmitter();

const coroutinesList = [];

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

let senderPromises = {};
let receiverPromises = {};

const kopi_spawn = (fn, scope, visitors) => {
  const coroutineId = nextCoroutineId++;

  coroutinesList.push({
    id: coroutineId,
    started: Date.now(),
  });

  senderPromises[coroutineId] = new Deferred();
  receiverPromises[coroutineId] = new Deferred();

  coroutineEventEmitter.on(coroutineId, (event) => {
    receiverPromises[coroutineId].resolve(event.data);
  });

  fn.apply(undefined, [KopiTuple.empty, { ...scope, _coroutineId: coroutineId }, visitors]);

  return coroutineId;
};

const kopi_yield = async (fn, scope, visitors) => {
  const coroutineId = scope._coroutineId;

  const data = await receiverPromises[coroutineId];
  receiverPromises[coroutineId] = new Deferred();

  const value = fn.apply(undefined, [data, scope, visitors]);

  senderPromises[coroutineId].resolve(value);

  return new KopiTuple([data, value]);
};

const kopi_send = (coroutineId) => async (data) => {
  return new Promise(resolve => setImmediate(async () => {
    coroutineEventEmitter.emit(coroutineId, { data });

    const value = await senderPromises[coroutineId];
    senderPromises[coroutineId] = new Deferred();

    resolve(value);
  }));
};

const kopi_tasks = () => {
  console.log(`Id\tStarted`);
  coroutinesList.forEach(coroutine => {
    console.log(`${coroutine.id}\r\t${new Date(coroutine.started).toLocaleString()}`);
  });
};

module.exports = {
  kopi_spawn,
  kopi_yield,
  kopi_send,
  kopi_tasks,
};
