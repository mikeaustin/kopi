import _events from 'events';

import { KopiTuple } from '../classes.mjs';
import KopiSequence from '../classes/KopiSequence.mjs';

const { EventEmitter } = _events;

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

const kopi_spawn = (func, scope, visitors) => {
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

  func.apply(undefined, [KopiTuple.empty, {
    ...scope,
    _coroutineId: coroutineId,
  }, visitors]);

  return coroutineId;
};

const kopi_yield = async (func, scope, visitors) => {
  const coroutineId = scope._coroutineId;

  const data = await receiverPromises[coroutineId];
  receiverPromises[coroutineId] = new Deferred();

  const value = func.apply(undefined, [data, scope, visitors]);

  senderPromises[coroutineId].resolve(value);

  return new KopiTuple([data, value]);
};

const kopi_send = (coroutineId) => async (data) => {
  return new Promise((resolve) => setTimeout(async () => {
    coroutineEventEmitter.emit(coroutineId, { data });

    const value = await senderPromises[coroutineId];
    senderPromises[coroutineId] = new Deferred();

    resolve(value);
  }));
};

class Timer {
  async *[Symbol.asyncIterator]() {
    let deferred = new Deferred();

    const inner = (ms) => {
      setTimeout(() => {
        deferred.resolve(Date.now());

        deferred = new Deferred();

        inner(ms);
      }, ms - new Date().getMilliseconds());
    };

    inner(1000);

    for (; ;) {
      yield deferred;
    }
  }

  async each(func, scope, visitors) {
    for await (const value of this) {
      func.apply(undefined, [value, scope, visitors]);
    }
  }

  async take(count) {
    return new KopiSequence((async function* take() {
      for await (const value of this) {
        if (count-- === 0) {
          return value;
        }

        yield value;
      }
    }).apply(this));
  }
}

const kopi_timer = function () {
  return new Timer();
};

kopi_timer.nativeConstructor = Timer;

const kopi_tasks = () => {
  console.log('Id\tStarted');
  coroutinesList.forEach((coroutine) => {
    console.log(`${coroutine.id}\r\t${new Date(coroutine.started).toLocaleString()}`);
  });
};

export {
  kopi_spawn,
  kopi_yield,
  kopi_send,
  kopi_timer,
  kopi_tasks,
};
