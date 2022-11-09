/* eslint-disable no-extend-native */

import { RawASTNode, ASTNode, Evaluate, Environment, Bindings, Trait, Applicative } from './modules/shared';
import { inspect } from './modules/utils';

import * as operators from './modules/operators';
import * as terminals from './modules/terminals';

import { KopiValue, Extensions } from './modules/shared';
import { KopiNumber, KopiType, KopiString, KopiFunction, KopiTuple } from './modules/terminals/classes';

import KopiIterable from './modules/operators/traits/KopiIterable';
import KopiStream from './modules/terminals/classes/KopiStream';

declare global {
  interface FunctionConstructor {
    traits: Trait[];
  }

  interface Function {
    inspect(): Promise<string>;
    getElementAtIndex(index: number): Promise<KopiValue | undefined>;
    force(): Promise<KopiValue>;
    invoke(
      methodName: string,
      [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
    ): Promise<KopiValue>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(`<native-function>`);
};

Function.traits = [Applicative];

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

class Coroutine extends KopiValue {
  deferred: Deferred[];

  constructor() {
    super();

    this.deferred = [new Deferred(), new Deferred()];
  }

  async yield(func: KopiFunction) {
    const data = await this.deferred[0] as KopiValue;
    this.deferred[0] = new Deferred();

    const value = await func.apply(new KopiTuple([]), [data, evaluate, environment]);

    (this.deferred[1] as any).resolve(value);
    this.deferred[1] = new Deferred();
  }

  async send(value: KopiValue, evaluate: Evaluate, environment: Environment) {
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

const environment: {
  [name: string]: KopiValue;
} = {
  x: new KopiNumber(3),

  String: new KopiType(KopiString),

  async spawn(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    const coroutine = new Coroutine();

    func.apply(new KopiTuple([]), [coroutine.yield.bind(coroutine), evaluate, environment]);

    return coroutine;
  },

  async print(value: KopiValue) {
    console.log(value);

    return new KopiTuple([]);
  },

  async iterate(value: KopiValue) {
    return function (func: KopiFunction) {
      let result = value;

      const generator = (async function* () {
        for (; ;) {
          yield result = await func.apply(new KopiTuple([]), [result, evaluate, environment]);
        }
      })();

      return new KopiStream(generator);
    };
  },

  match(value: KopiValue) {
    return async (tuple: KopiTuple) => {
      for await (const func of tuple.elements) {
        const matches = await (func as KopiFunction).parameterPattern.match(value, evaluate, environment);

        if (matches) {
          return (func as KopiFunction).apply(new KopiTuple([]), [value, evaluate, environment]);
        }
      }

      throw new Error('Match failed');
    };
  },

  // extend: () => {},

  async let(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    let result: KopiValue = new KopiTuple([]);

    do {
      const result2 = result instanceof KopiLoop ? result.value : result;

      result = await func.apply(new KopiTuple([]), [result2, evaluate, environment]);
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

const evaluate = (ast: ASTNode, environment: Environment, bindValues?: (bindings: { [name: string]: KopiValue; }) => void) => {
  return evaluatePipeline(ast, environment, bindValues);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

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
