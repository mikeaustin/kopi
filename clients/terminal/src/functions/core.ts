import { Context, Extensions, KopiValue } from '../modules/shared';

import { KopiContext, KopiCoroutine, KopiFunction, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes';

class KopiLoop extends KopiValue {
  constructor(value: KopiValue) {
    super();

    this.value = value;
  }

  value: KopiValue;
}

//

async function kopi_print(value: KopiValue) {
  console.log(await value.toString());

  return KopiTuple.empty;
}

function kopi_match(value: KopiValue, context: Context) {
  return async (tuple: KopiTuple) => {
    for await (const func of tuple.fields) {
      const matches = await (func as KopiFunction).parameterPattern.match(value, context);

      if (matches) {
        return (func as KopiFunction).apply(KopiTuple.empty, [value, context]);
      }
    }

    throw new Error('Match failed');
  };
}

async function kopi_sleep(number: KopiNumber) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(number), number.value * 1000);
  });
}

async function kopi_let(func: KopiFunction, context: Context) {
  let result: KopiValue = KopiTuple.empty;

  do {
    const result2 = result instanceof KopiLoop ? result.value : result;

    result = await func.apply(KopiTuple.empty, [result2, context]);
  } while (result instanceof KopiLoop);

  return result instanceof KopiLoop ? result.value : result;
}

async function kopi_loop(value: KopiValue) {
  return new KopiLoop(value);
}

async function kopi_type(type: KopiTuple) {
  const _constructor = class extends (type as any).constructor {
    static async apply(
      thisArg: KopiValue,
      [tuple, context]: [KopiTuple, Context]
    ): Promise<KopiValue> {
      return new (_constructor as unknown as typeof KopiTuple)(tuple._fields, tuple.fieldNames);
    }
  };

  Object.defineProperty(_constructor, 'name', { value: 'Custom' });

  return _constructor;
}

async function kopi_extend(type: Function, context: Context) {
  const extensions = (context.environment._extensions as Extensions);

  return async (methods: KopiTuple) => {
    const newMethods = await methods.fields.reduce(async (newMethods, method, index) => ({
      ...await newMethods,
      [methods.fieldNames[index] ?? 'invalid']: await method,
    }), extensions.map.get(type) ?? {});

    context.bindValues({
      _extensions: new Extensions([...extensions.map, [type, newMethods]])
    });
  };
}

async function kopi_iterate(value: KopiValue, context: Context) {
  return function (func: KopiFunction) {
    let result = value;

    const generator = (async function* () {
      for (; ;) {
        yield result = await func.apply(KopiTuple.empty, [result, context]);
      }
    })();

    return new KopiStream(generator);
  };
}

async function kopi_fetch(url: KopiString) {
  const data = fetch(url.value);

  return new KopiString(await (await data).text());
}

async function kopi_context(value: KopiValue, context: Context) {
  const { bindValues } = context;

  return new KopiContext(value, bindValues);
}

async function kopi_spawn(func: KopiFunction, context: Context) {
  const coroutine = new KopiCoroutine();

  func.apply(KopiTuple.empty, [coroutine.yield.bind(coroutine), context]);

  return coroutine;
}

export {
  kopi_print,
  kopi_match,
  kopi_sleep,

  kopi_let,
  kopi_loop,

  kopi_type,
  kopi_extend,

  kopi_iterate,
  kopi_fetch,
  kopi_context,
  kopi_spawn,
};
