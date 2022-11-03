import { RawASTNode, ASTNode, KopiValue, Transform, Evaluate, Environment } from '../shared';

import * as astNodes from './astNodes';
import * as visitorsx from './visitors';

const transform = (next: Transform, transform: Transform) =>
  (rawAstNode: RawASTNode): ASTNode => {
    switch (rawAstNode.type) {
      case 'PipeExpression':
        return new astNodes.PipeExpression({
          expression: transform(rawAstNode.expression),
          methodName: rawAstNode.methodName,
          argumentExpression: rawAstNode.argumentExpression ? transform(rawAstNode.argumentExpression) : rawAstNode.argumentExpression,
        } as astNodes.PipeExpression);
      case 'BlockExpression':
        return new astNodes.BlockExpression({
          statements: rawAstNode.statements.map((statement: ASTNode) => transform(statement)),
        } as astNodes.BlockExpression);
      case 'OperatorExpression':
        return new astNodes.OperatorExpression({
          operator: rawAstNode.operator,
          leftExpression: transform(rawAstNode.leftExpression),
          rightExpression: transform(rawAstNode.rightExpression),
          location: rawAstNode.location,
        } as astNodes.OperatorExpression);
      case 'UnaryExpression':
        return new astNodes.UnaryExpression({
          operator: rawAstNode.operator,
          argumentExpression: transform(rawAstNode.argumentExpression),
          location: rawAstNode.location,
        } as astNodes.UnaryExpression);
      case 'FunctionExpression':
        return new astNodes.FunctionExpression({
          parameterPattern: transform(rawAstNode.parameterPattern),
          bodyExpression: transform(rawAstNode.bodyExpression),
          location: rawAstNode.location,
        } as astNodes.FunctionExpression);
      case 'TupleExpression':
        return new astNodes.TupleExpression({
          expressionElements: rawAstNode.expressionElements.map((expressionElement: ASTNode) => transform(expressionElement)),
          location: rawAstNode.location,
        } as astNodes.TupleExpression);
      case 'ApplyExpression':
        return new astNodes.ApplyExpression({
          expression: transform(rawAstNode.expression),
          argumentExpression: transform(rawAstNode.argumentExpression),
          location: rawAstNode.location,
        } as astNodes.ApplyExpression);
      case 'RangeExpression':
        return new astNodes.RangeExpression({
          from: transform(rawAstNode.from),
          to: transform(rawAstNode.to),
          location: rawAstNode.location,
        } as astNodes.RangeExpression);
      default:
        return next(rawAstNode);
    }
  };

const evaluate = (next: Evaluate, evaluate: Evaluate) =>
  async (astNode: ASTNode, environment: Environment): Promise<KopiValue> => {
    if (astNode instanceof astNodes.PipeExpression) {
      return visitorsx.PipeExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.BlockExpression) {
      return visitorsx.BlockExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.OperatorExpression) {
      return visitorsx.OperatorExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.UnaryExpression) {
      return visitorsx.UnaryExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.TupleExpression) {
      return visitorsx.TupleExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.FunctionExpression) {
      return visitorsx.FunctionExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.ApplyExpression) {
      return visitorsx.ApplyExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.RangeExpression) {
      return visitorsx.RangeExpression(astNode, evaluate, environment);
    } else {
      return next(astNode, environment);
    }
  };

export {
  transform,
  evaluate,
};
