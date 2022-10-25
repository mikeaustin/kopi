import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment } from './modules2/shared';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

// const ast = parser.parse('(1 + 2) * x');
const ast = parser.parse('() => (1 + 2) * x');

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform, transform);

const evaluate = (ast: ASTNode, environment: Environment) => {
  return evaluatePipeline(ast, environment);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const environment = {
  x: new terminals.KopiNumber(3)
};

const transformedAst = transformPipeline(ast);

const main = async () => {
  console.log(transformedAst);
  console.log(await evaluate(transformedAst, environment).inspect());
};

main();
