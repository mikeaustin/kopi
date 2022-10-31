import { RawASTNode, ASTNode, Evaluate, Environment, Bindings } from './modules2/shared';
import { inspect } from './modules2/utils';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

import { KopiValue, Extensions } from './modules2/shared';
import { KopiNumber, KopiType, KopiString, NativeFunction, KopiFunction, KopiTuple } from './modules2/terminals/classes';

const environment: {
  [name: string]: KopiValue;
} = {
  x: new KopiNumber(3),
  String: new KopiType(KopiString),
  // extend: () => {},
  let: new NativeFunction(
    'let',
    KopiFunction,
    async (value: KopiFunction, evaluate: Evaluate, environment: Environment) => {
      return value.apply(new KopiTuple([]), [new KopiTuple([]), evaluate, environment]);
    }
  ),
  sleep: new NativeFunction('sleep', KopiNumber, async (value: KopiNumber,) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), value.value * 1000);
    });
  }),
  fetch: new NativeFunction('fetch', KopiValue, async (url: KopiValue) => {
    return new KopiNumber(5);
  }),
  _extensions: new Extensions([[KopiString, {
    capitalize: new NativeFunction('capitalize', KopiTuple, async function (this: KopiString, value: KopiString) {
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
