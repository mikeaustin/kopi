/* eslint-disable no-extend-native */

import { RawASTNode, ASTNode, Environment, Context, BindValues, KopiTrait, KopiApplicative, addTraits, Bindings } from './modules/shared';

import * as operators from './modules/operators';
import * as terminals from './modules/terminals';

import { KopiValue, Extensions } from './modules/shared';
import { KopiNumber, KopiType, KopiString, KopiFunction, KopiTuple, KopiArray } from './modules/terminals/classes';

import KopiStream from './modules/terminals/classes/KopiStream';
import KopiIterable from './modules/operators/traits/KopiIterable';

declare global {
  interface FunctionConstructor {
    traits: KopiTrait[];
  }

  interface Function {
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    toJS(): Promise<KopiValue>;
    invoke(
      methodName: string,
      [argument, context]: [KopiValue, Context]
    ): Promise<KopiValue>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(`<native-function>`);
};

Function.traits = [KopiApplicative];

//

class Deferred {
  constructor() {
    const promise = new Promise<KopiValue>((resolve, reject) => {
      const timeoutId = setTimeout(() => reject, Math.pow(2, 32) / 2 - 1);

      (this as any).resolve = (value: KopiValue) => {
        clearTimeout(timeoutId);

        resolve(value);
      };

      (this as any).reject = reject;
    });

    (promise as any).resolve = (this as any).resolve;
    (promise as any).reject = (this as any).reject;

    return promise;
  }
}

class KopiCoroutine extends KopiValue {
  deferred: Deferred[];

  constructor() {
    super();

    this.deferred = [new Deferred(), new Deferred()];
  }

  async yield(func: KopiFunction, context: Context) {
    const data = await this.deferred[0] as KopiValue;
    this.deferred[0] = new Deferred();

    const value = await func.apply(new KopiTuple([]), [data, context]);

    (this.deferred[1] as any).resolve(value);
    this.deferred[1] = new Deferred();
  }

  async send(value: KopiValue) {
    (this.deferred[0] as any).resolve(value);

    const x = await this.deferred[1];
    this.deferred[1] = new Deferred();

    return x;
  }
}

//

class KopiLoop extends KopiValue {
  constructor(value: KopiValue) {
    super();

    this.value = value;
  }

  value: KopiValue;
}

class KopiContext extends KopiValue {
  constructor(value: KopiValue, bindValues: BindValues) {
    super();

    this.symbol = Symbol();
    this.value = value;

    bindValues({
      [this.symbol]: value,
    });
  }

  set(value: KopiValue, context: Context) {
    const { bindValues } = context;

    bindValues({
      [this.symbol]: value,
    });
  }

  get(value: KopiValue, context: Context) {
    const { environment } = context;

    return environment[this.symbol as keyof typeof environment];
  }

  symbol: symbol;
  value: KopiValue;
}

class Observer extends KopiValue {
  static emptyValue = () => new KopiArray([]);

  promise: Deferred;

  constructor(value: KopiValue) {
    super();

    this.promise = new Deferred();
  }

  set(value: KopiValue) {
    console.log('Observer.set');
    (this.promise as any).resolve(value);
    this.promise = new Deferred();

    return this;
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      yield this.promise;
    }
  }
}

addTraits([KopiIterable], Observer);

class Timer extends KopiValue {
  *[Symbol.asyncIterator]() {
    let deferred = new Deferred();

    setInterval(() => {
      (deferred as any).resolve(new KopiNumber(Date.now()));

      deferred = new Deferred();
    }, 500);

    for (; ;) {
      yield deferred;
    }
  }
}

addTraits([KopiIterable], Timer);

const environment: {
  [name: string]: KopiValue;
} = {
  x: new KopiNumber(3),

  String: new KopiType(KopiString),

  Observer(value: KopiValue) {
    return new Observer(value);
  },

  async timer() {
    return new Timer();
  },

  async type(type: KopiTuple) {
    const _constructor = class extends (type as any).constructor {
      constructor(tuple: KopiTuple) {
        super(tuple.fields, tuple.fieldNames);
        // Add copy constructor
      }
    };

    Object.defineProperty(_constructor, 'name', { value: 'Custom' });

    return new KopiType(_constructor);
  },

  async context(value: KopiValue, context: Context) {
    const { bindValues } = context;

    return new KopiContext(value, bindValues);
  },

  async spawn(func: KopiFunction, context: Context) {
    const coroutine = new KopiCoroutine();

    func.apply(new KopiTuple([]), [coroutine.yield.bind(coroutine), context]);

    return coroutine;
  },

  async print(value: KopiValue) {
    console.log(value);

    return new KopiTuple([]);
  },

  async extend(type: KopiType, context: Context) {
    const extensions = (context.environment._extensions as Extensions);

    return async (methods: KopiTuple) => {
      const newMethods = await methods.fields.reduce(async (newMethods, method, index) => ({
        ...await newMethods,
        [methods.fieldNames[index] ?? 'invalid']: await method,
      }), extensions.map.get(type._constructor) ?? {});

      context.bindValues({
        _extensions: new Extensions([...extensions.map, [type._constructor, newMethods]])
      });
    };
  },

  async iterate(value: KopiValue, context: Context) {
    return function (func: KopiFunction) {
      let result = value;

      const generator = (async function* () {
        for (; ;) {
          yield result = await func.apply(new KopiTuple([]), [result, context]);
        }
      })();

      return new KopiStream(generator);
    };
  },

  match(value: KopiValue, context: Context) {
    return async (tuple: KopiTuple) => {
      for await (const func of tuple.fields) {
        const matches = await (func as KopiFunction).parameterPattern.match(value, context);

        if (matches) {
          return (func as KopiFunction).apply(new KopiTuple([]), [value, context]);
        }
      }

      throw new Error('Match failed');
    };
  },

  // extend: () => {},

  async let(func: KopiFunction, context: Context) {
    let result: KopiValue = new KopiTuple([]);

    do {
      const result2 = result instanceof KopiLoop ? result.value : result;

      result = await func.apply(new KopiTuple([]), [result2, context]);
    } while (result instanceof KopiLoop);

    return result instanceof KopiLoop ? result.value : result;
  },

  async loop(value: KopiValue) {
    return new KopiLoop(value);
  },

  async sleep(number: KopiNumber) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  },

  async fetch(url: KopiString) {
    const data = fetch(url.value);

    return new KopiString(await (await data).text());
  },

  _extensions: new Extensions([[KopiString, {
    capitalize: async function (this: KopiString, tuple: KopiValue) {
      return new KopiString(this.value.toUpperCase());
    }
  }]])
};

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform(transform), transform);

const evaluate = (ast: ASTNode, environment: Environment, bindValues: BindValues) => {
  return evaluatePipeline(ast, environment, bindValues);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate(evaluate), evaluate);

// const transformedAst = transformPipeline(ast);

// const main = async () => {
//   // console.log(inspect(transformedAst));
//   // console.log(await (await evaluate(transformedAst, environment)).inspect());
// };

// main();

export {
  transform,
  evaluate,
  environment,
};
