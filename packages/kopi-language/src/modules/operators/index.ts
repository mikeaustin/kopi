import { RawASTNode, ASTNode, KopiValue, Transform, Evaluate, Environment, BindValues } from '../shared.js';

import * as astNodes from './astNodes.js';
import * as visitors from './visitors.js';

const transformAst = (next: Transform, transformAst: Transform) =>
  (rawAstNode: RawASTNode): ASTNode => {
    switch (rawAstNode.type) {
      case 'Assignment':
        return new astNodes.Assignment({
          pattern: transformAst(rawAstNode.pattern),
          expression: transformAst(rawAstNode.expression),
        } as astNodes.Assignment);
      case 'PipeExpression':
        return new astNodes.PipeExpression({
          expression: transformAst(rawAstNode.expression),
          methodName: rawAstNode.methodName,
          argumentExpression: rawAstNode.argumentExpression ? transformAst(rawAstNode.argumentExpression) : rawAstNode.argumentExpression,
        } as astNodes.PipeExpression);
      case 'BlockExpression':
        return new astNodes.BlockExpression({
          statements: rawAstNode.statements.map((statement: ASTNode) => transformAst(statement)),
        } as astNodes.BlockExpression);
      case 'OperatorExpression':
        return new astNodes.OperatorExpression({
          operator: rawAstNode.operator,
          leftExpression: transformAst(rawAstNode.leftExpression),
          rightExpression: transformAst(rawAstNode.rightExpression),
          location: rawAstNode.location,
        } as astNodes.OperatorExpression);
      case 'MemberExpression':
        return new astNodes.MemberExpression({
          expression: transformAst(rawAstNode.expression),
          member: rawAstNode.member,
        } as astNodes.MemberExpression);
      case 'UnaryExpression':
        return new astNodes.UnaryExpression({
          operator: rawAstNode.operator,
          argumentExpression: transformAst(rawAstNode.argumentExpression),
          location: rawAstNode.location,
        } as astNodes.UnaryExpression);
      case 'FunctionExpression':
        return new astNodes.FunctionExpression({
          parameterPattern: transformAst(rawAstNode.parameterPattern),
          bodyExpression: transformAst(rawAstNode.bodyExpression),
          location: rawAstNode.location,
        } as astNodes.FunctionExpression);
      case 'TupleExpression':
        return new astNodes.TupleExpression({
          expressionFields: rawAstNode.expressionFields.map((expressionElement: ASTNode) => transformAst(expressionElement)),
          expressionFieldNames: rawAstNode.expressionFieldNames,
          location: rawAstNode.location,
        } as astNodes.TupleExpression);
      case 'ApplyExpression':
        return new astNodes.ApplyExpression({
          expression: transformAst(rawAstNode.expression),
          argumentExpression: transformAst(rawAstNode.argumentExpression),
          location: rawAstNode.location,
        } as astNodes.ApplyExpression);
      default:
        return next(rawAstNode);
    }
  };

const evaluateAst = (next: Evaluate, evaluateAst: Evaluate) =>
  async (astNode: ASTNode, environment: Environment, bindValues: BindValues): Promise<KopiValue> => {
    const context = { environment, evaluateAst, bindValues };

    if (astNode instanceof astNodes.Assignment) {
      return visitors.Assignment(astNode, context);
    } else if (astNode instanceof astNodes.PipeExpression) {
      return visitors.PipeExpression(astNode, context);
    } else if (astNode instanceof astNodes.BlockExpression) {
      return visitors.BlockExpression(astNode, context);
    } else if (astNode instanceof astNodes.OperatorExpression) {
      return visitors.OperatorExpression(astNode, context);
    } else if (astNode instanceof astNodes.MemberExpression) {
      return visitors.MemberExpression(astNode, context);
    } else if (astNode instanceof astNodes.UnaryExpression) {
      return visitors.UnaryExpression(astNode, context);
    } else if (astNode instanceof astNodes.TupleExpression) {
      return visitors.TupleExpression(astNode, context);
    } else if (astNode instanceof astNodes.FunctionExpression) {
      return visitors.FunctionExpression(astNode, context);
    } else if (astNode instanceof astNodes.ApplyExpression) {
      return visitors.ApplyExpression(astNode, context);
    } else {
      return next(astNode, environment, bindValues);
    }
  };

export {
  transformAst,
  evaluateAst,
};
