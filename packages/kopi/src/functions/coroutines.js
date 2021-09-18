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

let coroutinePromises = {};
let coroutinePromises2 = {};

const kopi_spawn = (fn, scope, visitors) => {
  const coroutineId = nextCoroutineId++;

  coroutinesList.push({
    id: coroutineId,
    started: Date.now(),
  });

  coroutinePromises[coroutineId] = new Deferred();
  coroutinePromises2[coroutineId] = new Deferred();

  coroutineEventEmitter.on(coroutineId, (event) => {
    event.promise = coroutinePromises[coroutineId];

    coroutinePromises2[coroutineId].resolve(event.data);
  });

  fn.apply(undefined, [KopiTuple.empty, { ...scope, _coroutineId: coroutineId }, visitors]);

  return coroutineId;
};

const kopi_yield = async (fn, scope, visitors) => {
  const coroutineId = scope._coroutineId;

  const data = await coroutinePromises2[coroutineId];
  coroutinePromises2[coroutineId] = new Deferred();

  const value = fn.apply(undefined, [data, scope, visitors]);

  coroutinePromises[coroutineId].resolve(value);

  return new KopiTuple([data, value]);
};

const kopi_send = (coroutineId) => async (data) => {
  return new Promise(resolve => setImmediate(async () => {
    const event = { data };
    coroutineEventEmitter.emit(coroutineId, event);

    const value = await event.promise;
    coroutinePromises[coroutineId] = new Deferred();

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
