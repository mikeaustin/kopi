import { KopiString, KopiTuple } from '../classes.mjs';

const kopi_inspect = async (value) => {
  console.log(await value.inspectAsync());
};

const kopi_print = async (value) => {
  console.log(await value.toStringAsync());
};

const kopi_char = (number) => {
  return new KopiString(String.fromCodePoint(number));
};

const kopi_random = () => {
  return Math.random();
};

const kopi_date = () => {
  return new KopiString(new Date().toLocaleDateString());
};

const kopi_time = () => {
  return new KopiString(new Date().toLocaleTimeString());
};

const kopi_ident = (x) => {
  return x;
};

const kopi_even = (number) => {
  return number % 2 === 0;
};

const kopi_max = (tuple) => {
  return Math.max(tuple.getElementAtIndex(0), tuple.getElementAtIndex(1));
};

const kopi_let = (func, scope, visitors) => {
  return func.apply(undefined, [KopiTuple.empty, scope, visitors]);
};

const kopi_match = (value) => async (_funcs, scope, visitors) => {
  const funcsTuple = _funcs.apply ? new KopiTuple([_funcs]) : _funcs;

  for await (const func of funcsTuple.getElementsArray()) {
    const matches = await func.params.getMatches(value);

    const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
      ...scope,
      ...matches,
    }));

    if (predicatePassed && matches) {
      return func.apply(undefined, [value, { ...scope, ...matches }, visitors]);
    }
  }

  console.log('match failed.');
};

const kopi_loop = async (func, scope, visitors) => {
  let value = KopiTuple.empty;

  for (let index = 0; ; ++index) {
    value = await func.apply(undefined, [value, scope, visitors]);

    if (value.constructor.name === 'Exit') {
      return value.value;
    }

    if (index % 1000 === 0) {
      globalThis.gc();

      await kopi_sleep(0);
    }
  }
};

class Exit {
  constructor(value) {
    this.value = value;
  }

  inspectAsync() {
    return 'Break';
  }
}

kopi_loop.break = (value) => new Exit(value);

const kopi_write = (value) => {
  return new Promise((resolve) => process.stdout.write(value.toStringAsync(), () => resolve()));
};

const kopi_sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(() => resolve(seconds), seconds * 1000));
};

const kopi_extend = (constructor) => async (methodsTuple, scope, visitors, bind) => {
  const { nativeConstructor } = constructor;
  const methods = globalThis.methods[globalThis.methods.length - 1];

  const newMethods = await methodsTuple.getElementsArray().reduce(async (newMethods, method, index) => ({
    ...await newMethods,
    [methodsTuple.getFieldNameAtIndex(index)]: await method,
  }), methods.get(nativeConstructor) ?? {});

  globalThis.methods[globalThis.methods.length - 1] = new Map(methods).set(nativeConstructor, newMethods);
};

export {
  kopi_inspect,
  kopi_print,
  kopi_char,
  kopi_random,
  kopi_date,
  kopi_time,
  kopi_ident,
  kopi_even,
  kopi_max,
  kopi_let,
  kopi_match,
  kopi_loop,
  kopi_write,
  kopi_sleep,
  kopi_extend,
};
