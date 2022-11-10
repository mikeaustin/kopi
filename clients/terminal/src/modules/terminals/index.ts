import { RawASTNode, ASTNode, ASTPatternNode, KopiValue, Transform, Environment, Evaluate, BindValues } from '../shared';
import { inspect } from '../utils';

import * as astNodes from './astNodes';
import * as operatorsAstNodes from '../operators/astNodes';

import * as visitors from './visitors';
import * as operatorsVisitors from '../operators/visitors';

// const transform2 = (transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
//   if ()
// };

const transform = (transform: Transform) => (rawAstNode: RawASTNode) => {
  switch (rawAstNode.type) {
    case 'NumericLiteral':
      return new astNodes.NumericLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.NumericLiteral);
    case 'BooleanLiteral':
      return new astNodes.BooleanLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.BooleanLiteral);
    case 'StringLiteral':
      return new astNodes.StringLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.StringLiteral);
    case 'ArrayLiteral':
      return new astNodes.ArrayLiteral({
        expressionElements: rawAstNode.expressionElements.map((expression: ASTNode) => transform(expression)),
        location: rawAstNode.location,
      } as astNodes.ArrayLiteral);
    case 'AstLiteral':
      return new astNodes.AstLiteral({
        value: transform(rawAstNode.value),
        location: rawAstNode.location,
      } as astNodes.AstLiteral);
    case 'Identifier':
      return new astNodes.Identifier({
        name: rawAstNode.name,
        location: rawAstNode.location,
      } as astNodes.Identifier);
    case 'NumericLiteralPattern':
      return new astNodes.NumericLiteralPattern({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.NumericLiteralPattern);
    case 'IdentifierPattern':
      return new astNodes.IdentifierPattern({
        name: rawAstNode.name,
        location: rawAstNode.location,
        defaultExpression: rawAstNode.defaultExpression
          ? transform(rawAstNode.defaultExpression)
          : rawAstNode.defaultExpression,
      } as astNodes.IdentifierPattern);
    case 'TuplePattern':
      return new astNodes.TuplePattern({
        patterns: rawAstNode.patterns.map((pattern: ASTPatternNode) => transform(pattern)),
        location: rawAstNode.location,
      } as astNodes.TuplePattern);
    case 'FunctionPattern':
      return new astNodes.FunctionPattern({
        name: rawAstNode.name,
        parameterPattern: transform(rawAstNode.parameterPattern),
        location: rawAstNode.location,
      } as astNodes.FunctionPattern);
  }

  throw new Error(`No transform found for '${inspect(rawAstNode)}'`);
};

const evaluate = (evaluate: Evaluate) =>
  async (astNode: ASTNode, environment: Environment, bindValues: BindValues): Promise<KopiValue> => {
    if (astNode instanceof astNodes.NumericLiteral) {
      return visitors.NumericLiteral(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.BooleanLiteral) {
      return visitors.BooleanLiteral(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.StringLiteral) {
      return visitors.StringLiteral(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.ArrayLiteral) {
      return visitors.ArrayLiteral(astNode, evaluate, environment, bindValues);
    } else if (astNode instanceof astNodes.AstLiteral) {
      return astNode.value;
    } else if (astNode instanceof astNodes.Identifier) {
      return visitors.Identifier(astNode, evaluate, environment);
    } else {
      throw new Error(`No visitor found for '${inspect(astNode)}'`);
    }
  };

export {
  transform,
  evaluate,
};
