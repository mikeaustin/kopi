/* eslint-disable no-extend-native */

import { RawASTNode, ASTNode, Evaluate, Environment, Bindings, Trait, Applicative } from './modules/shared';
import { inspect } from './modules/utils';

import * as operators from './modules/operators';
import * as terminals from './modules/terminals';

import { KopiValue, Extensions } from './modules/shared';
import { KopiNumber, KopiType, KopiString, KopiFunction, KopiTuple } from './modules/terminals/classes';

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

class Coroutine extends KopiValue {
  yield(value: KopiFunction) {
    this._yield = value;

    return new Promise(resolve => { });
  }

  async send(value: KopiValue) {
    console.log('Coroutine.send():', value);

    return new KopiTuple([]);
  }

  _yield: KopiFunction | undefined;
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
  spawn: async (func: KopiFunction, evaluate: Evaluate, environment: Environment) => {
    const coroutine = new Coroutine();

    func.apply(new KopiTuple([]), [coroutine.yield.bind(coroutine), evaluate, environment]);

    return coroutine;
  },
  print: async (value: KopiValue) => {
    console.log(value);

    return new KopiTuple([]);
  },
  match: (value: KopiValue) => async (tuple: KopiTuple) => {
    for await (const func of tuple.elements) {
      const matches = await (func as KopiFunction).parameterPattern.match(value, evaluate, environment);

      if (matches) {
        return (func as KopiFunction).apply(new KopiTuple([]), [value, evaluate, environment]);
      }
    }

    throw new Error('Match failed');
  },
  // extend: () => {},
  let: async (func: KopiFunction, evaluate: Evaluate, environment: Environment) => {
    let result: KopiValue = new KopiTuple([]);

    do {
      const result2 = result instanceof KopiLoop ? result.value : result;

      result = await func.apply(new KopiTuple([]), [result2, evaluate, environment]);
    } while (result instanceof KopiLoop);

    return result instanceof KopiLoop ? result.value : result;
  },
  loop: async (value: KopiValue) => {
    return new KopiLoop(value);
  },
  sleep: async (number: KopiNumber,) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  },
  fetch: async (url: KopiString) => {
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
