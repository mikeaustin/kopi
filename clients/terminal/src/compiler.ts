/* eslint-disable no-extend-native */

import { RawASTNode, ASTNode, Environment, Context, BindValues, KopiTrait, KopiApplicative } from './modules/shared';

import * as operators from './modules/operators';
import * as terminals from './modules/terminals';

import { KopiValue, Extensions } from './modules/shared';
import { KopiNumber, KopiType, KopiString, KopiFunction, KopiTuple, KopiCoroutine, KopiContext, KopiSubject, KopiTimer } from './modules/terminals/classes';

import KopiStream from './modules/terminals/classes/KopiStream';

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

  Observer(value: KopiValue) {
    return new KopiSubject(value);
  },

  async timer() {
    return new KopiTimer();
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

    func.apply(KopiTuple.empty, [coroutine.yield.bind(coroutine), context]);

    return coroutine;
  },

  async print(value: KopiValue) {
    console.log(await value.toString());

    return KopiTuple.empty;
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
          yield result = await func.apply(KopiTuple.empty, [result, context]);
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
          return (func as KopiFunction).apply(KopiTuple.empty, [value, context]);
        }
      }

      throw new Error('Match failed');
    };
  },

  // extend: () => {},

  async let(func: KopiFunction, context: Context) {
    let result: KopiValue = KopiTuple.empty;

    do {
      const result2 = result instanceof KopiLoop ? result.value : result;

      result = await func.apply(KopiTuple.empty, [result2, context]);
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

const evaluateAst = (ast: ASTNode, environment: Environment, bindValues: BindValues) => {
  return evaluateAstPipeline(ast, environment, bindValues);
};

const evaluateAstPipeline = operators.evaluateAst(terminals.evaluateAst(evaluateAst), evaluateAst);

// const transformedAst = transformPipeline(ast);

// const main = async () => {
//   // console.log(inspect(transformedAst));
//   // console.log(await (await evaluate(transformedAst, environment)).inspect());
// };

// main();

export {
  transform,
  evaluateAst,
  environment,
};
