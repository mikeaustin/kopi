import { RawASTNode, ASTNode, KopiValue, Transform, Evaluate, Environment } from '../shared';
import { KopiTuple } from '../terminals/classes';

import * as astNodes from './astNodes';
import * as visitors from './visitors';

const transform = (next: Transform, transform: Transform) =>
  (rawAstNode: RawASTNode): ASTNode => {
    switch (rawAstNode.type) {
      case 'Assignment':
        return new astNodes.Assignment({
          pattern: transform(rawAstNode.pattern),
          expression: transform(rawAstNode.expression),
        } as astNodes.Assignment);
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
      case 'MemberExpression':
        return new astNodes.MemberExpression({
          expression: transform(rawAstNode.expression),
          member: rawAstNode.member,
        } as astNodes.MemberExpression);
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
          expressionFields: rawAstNode.expressionFields.map((expressionElement: ASTNode) => transform(expressionElement)),
          expressionFieldNames: rawAstNode.expressionFieldNames,
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
  async (astNode: ASTNode, environment: Environment, bindValues?: (bindings: { [name: string]: KopiValue; }) => void): Promise<KopiValue> => {
    if (astNode instanceof astNodes.Assignment) {
      return visitors.Assignment(astNode, evaluate, environment, bindValues);
    } else if (astNode instanceof astNodes.PipeExpression) {
      return visitors.PipeExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.BlockExpression) {
      return visitors.BlockExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.OperatorExpression) {
      return visitors.OperatorExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.MemberExpression) {
      return visitors.MemberExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.UnaryExpression) {
      return visitors.UnaryExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.TupleExpression) {
      return visitors.TupleExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.FunctionExpression) {
      return visitors.FunctionExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.ApplyExpression) {
      return visitors.ApplyExpression(astNode, evaluate, environment);
    } else if (astNode instanceof astNodes.RangeExpression) {
      return visitors.RangeExpression(astNode, evaluate, environment);
    } else {
      return next(astNode, environment);
    }
  };

export {
  transform,
  evaluate,
};
