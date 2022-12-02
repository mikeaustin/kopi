import { RawASTNode, ASTNode, ASTPatternNode, KopiValue, Transform, Environment, Evaluate, BindValues } from '../shared';
import { inspect } from '../utils';

import * as astNodes from './astNodes';
import * as visitors from './visitors';

// const transformAst2 = (transformAst: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
//   if ()
// };

const transformAst = (transformAst: Transform) => (rawAstNode: RawASTNode) => {
  switch (rawAstNode.type) {
    case 'RangeExpression':
      return new astNodes.RangeExpression({
        from: transformAst(rawAstNode.from),
        to: transformAst(rawAstNode.to),
        location: rawAstNode.location,
      } as astNodes.RangeExpression);
    //
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
        expressionElements: rawAstNode.expressionElements.map((expression: ASTNode) => transformAst(expression)),
        location: rawAstNode.location,
      } as astNodes.ArrayLiteral);
    case 'DictLiteral':
      return new astNodes.DictLiteral({
        expressionEntries: rawAstNode.expressionEntries.map(
          ([key, expression]: [key: any, expression: ASTNode]) => [
            transformAst(key),
            transformAst(expression)
          ]
        ),
        location: rawAstNode.location,
      } as astNodes.DictLiteral);
    case 'AstLiteral':
      return new astNodes.AstLiteral({
        value: transformAst(rawAstNode.value),
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
    case 'StringLiteralPattern':
      return new astNodes.StringLiteralPattern({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.StringLiteralPattern);
    case 'BooleanLiteralPattern':
      return new astNodes.BooleanLiteralPattern({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as astNodes.BooleanLiteralPattern);
    case 'IdentifierPattern':
      return new astNodes.IdentifierPattern({
        name: rawAstNode.name,
        location: rawAstNode.location,
        defaultExpression: rawAstNode.defaultExpression
          ? transformAst(rawAstNode.defaultExpression)
          : rawAstNode.defaultExpression,
      } as astNodes.IdentifierPattern);
    case 'TuplePattern':
      return new astNodes.TuplePattern({
        patterns: rawAstNode.patterns.map((pattern: ASTPatternNode) => transformAst(pattern)),
        location: rawAstNode.location,
      } as astNodes.TuplePattern);
    case 'ArrayPattern':
      return new astNodes.ArrayPattern({
        patterns: rawAstNode.patterns.map((pattern: ASTPatternNode) => transformAst(pattern)),
        defaultExpression: rawAstNode.defaultExpression
          ? transformAst(rawAstNode.defaultExpression)
          : rawAstNode.defaultExpression,
        location: rawAstNode.location,
      } as astNodes.ArrayPattern);
    case 'FunctionPattern':
      return new astNodes.FunctionPattern({
        name: rawAstNode.name,
        parameterPattern: transformAst(rawAstNode.parameterPattern),
        location: rawAstNode.location,
      } as astNodes.FunctionPattern);
  }

  throw new Error(`No transformAst found for '${inspect(rawAstNode)}'`);
};

const evaluateAst = (evaluateAst: Evaluate) =>
  async (astNode: ASTNode, environment: Environment, bindValues: BindValues): Promise<KopiValue> => {
    const context = { environment, evaluateAst, bindValues };

    if (astNode instanceof astNodes.RangeExpression) {
      return visitors.RangeExpression(astNode, context);
    } else if (astNode instanceof astNodes.NumericLiteral) {
      return visitors.NumericLiteral(astNode, context);
    } else if (astNode instanceof astNodes.BooleanLiteral) {
      return visitors.BooleanLiteral(astNode, context);
    } else if (astNode instanceof astNodes.StringLiteral) {
      return visitors.StringLiteral(astNode, context);
    } else if (astNode instanceof astNodes.ArrayLiteral) {
      return visitors.ArrayLiteral(astNode, context);
    } else if (astNode instanceof astNodes.DictLiteral) {
      return visitors.DictLiteral(astNode, context);
    } else if (astNode instanceof astNodes.Identifier) {
      return visitors.Identifier(astNode, context);
    } else if (astNode instanceof astNodes.AstLiteral) {
      return astNode.value;
    } else {
      throw new Error(`No visitor found for '${inspect(astNode)}'`);
    }
  };

export {
  transformAst,
  evaluateAst,
};
