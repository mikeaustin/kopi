const { EventEmitter } = require('stream');

const { KopiTuple, KopiVector } = require('../classes');

const coroutineEventEmitter = new EventEmitter();

let nextCoroutineId = 0;

const spawn = (fn, scope, visitors) => {
  const coroutineId = nextCoroutineId++;

  fn.apply(undefined, [KopiTuple.empty, { ...scope, _coroutineId: coroutineId }, visitors]);

  return coroutineId;
};

const yield = (fn, scope, visitors) => {
  return new Promise(resolve => {
    coroutineEventEmitter.once(scope._coroutineId, (event) => {
      event.value = fn.apply(undefined, [event.data, scope, visitors]);

      resolve(event.value);
    });
  });
};

const send = (coroutineId) => (data) => {
  return new Promise(resolve => setImmediate(() => {
    const event = { data };
    coroutineEventEmitter.emit(coroutineId, event);

    resolve(event.value);
  }));
};

module.exports = {
  spawn,
  yield,
  send,
};
