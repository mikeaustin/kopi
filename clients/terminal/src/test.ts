import * as parser from './lib/parser';

import { ASTNode } from './modules2/shared';
import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';

const value = parser.parse('2 + 3');

const transform = (astNode: any) => {
  return transformPipeline(astNode);
};

const transformPipeline = operators.transform(terminals.transform, transform);

const evaluate = (astNode: ASTNode) => {
  return evaluatePipeline(astNode);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const transformedAST = transformPipeline(value);
console.log(
  transformedAST,
  evaluatePipeline(transformedAST)
);
