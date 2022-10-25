import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment } from './modules2/shared';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

const value = parser.parse('(1 + 2) * x');

const transform = (astNode: RawASTNode) => {
  return transformPipeline(astNode);
};

const transformPipeline = operators.transform(terminals.transform, transform);

const evaluate = (astNode: ASTNode, environment: Environment) => {
  return evaluatePipeline(astNode, environment);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const environment = {
  x: new terminals.KopiNumber(3)
};

const transformedAST = transformPipeline(value);

console.log(transformedAST, '\n', evaluatePipeline(transformedAST, environment));
