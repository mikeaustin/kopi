import { RawASTNode, ASTNode, Evaluate, Environment, Bindings, Trait, Applicative } from './modules2/shared';
import { inspect } from './modules2/utils';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

import { KopiValue, Extensions } from './modules2/shared';
import { KopiNumber, KopiType, KopiString, NativeFunction, KopiFunction, KopiTuple } from './modules2/terminals/classes';

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

const environment: {
  [name: string]: KopiValue;
} = {
  x: new KopiNumber(3),
  String: new KopiType(KopiString),
  print: async (value: KopiValue) => {
    console.log('print', await value.inspect());

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
    return func.apply(new KopiTuple([]), [new KopiTuple([]), evaluate, environment]);
  },
  sleep: async (number: KopiNumber,) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  },
  fetch: async (url: KopiValue) => {
    return new KopiNumber(5);
  },
  _extensions: new Extensions([[KopiString, {
    capitalize: new NativeFunction('capitalize', KopiTuple, async function (this: KopiString, tuple: KopiTuple) {
      return new KopiString(this.value.toUpperCase());
    })
  }]])
};

// const ast = parser.parse('(1, 2, 3)');
// const ast = parser.parse('(1, (() => 2), 3)');
// const ast = parser.parse('(1 + 2) * x');
// const ast = parser.parse('() => (1 + 2) * x');
// const ast = parser.parse('() => 2, 3');
// const ast = parser.parse('() => 2, 3, () => 2, 3');
// const ast = parser.parse('() => () => (2, 3)');
// const ast = parser.parse('(() => 5) ()');
// const ast = parser.parse('(() => 3) () + round 2.7');

// const ast = parser.parse('(sleep (sleep 1) + sleep (sleep 1), sleep 1 + sleep 1)');
// const ast = parser.parse(`5 * 'sin 1 + 5 * 'cos 1`);
// const ast = parser.parse(`'(('sin 5) 1, 'sin 5)`);
// const ast = parser.parse(`'('1, 2, 3)`);

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform(transform), transform);

const evaluate = (ast: ASTNode, environment: Environment) => {
  return evaluatePipeline(ast, environment);
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
