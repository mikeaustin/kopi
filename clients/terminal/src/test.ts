import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment } from './modules2/shared';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

import { KopiValue } from './modules2/shared';

// const ast = parser.parse('(1, 2, 3)');
// const ast = parser.parse('(1, (() => 2), 3)');
// const ast = parser.parse('(1 + 2) * x');
// const ast = parser.parse('() => (1 + 2) * x');
// const ast = parser.parse('() => 2, 3');
// const ast = parser.parse('() => 2, 3, () => 2, 3');
// const ast = parser.parse('() => () => (2, 3)');
// const ast = parser.parse('(() => 5) ()');
const ast = parser.parse('(() => 3) () + round 2.7');

/*
   1, (() => 2), 3
   1, (() => 2, 3)
   1, (() => 2), 3

   () => 2, 3, () => 2, 3

   () => 2, (3, () => 2, 3)

   () => 2, (3, () => 2, 3)
*/

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform, transform);

const evaluate = (ast: ASTNode, environment: Environment) => {
  return evaluatePipeline(ast, environment);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const environment = {
  x: new terminals.KopiNumber(3),
  round: ((value: KopiValue) => {
    if (!(value instanceof terminals.KopiNumber)) {
      throw new Error(`round() only accepts a number as an argument`);
    }

    return new terminals.KopiNumber(Math.round(value.value));
  }) as unknown as KopiValue,
};

const transformedAst = transformPipeline(ast);

const main = async () => {
  console.log(transformedAst);
  console.log(await evaluate(transformedAst, environment).inspect());
};

main();
