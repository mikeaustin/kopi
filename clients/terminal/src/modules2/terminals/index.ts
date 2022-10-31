import { Equals } from 'tsafe';
import { Evaluate } from '../shared';

import { RawASTNode, ASTNode, ASTPatternNode, Bindings, KopiValue, Environment, inspect } from '../shared';
import { KopiNumber, KopiBoolean, KopiString, KopiTuple } from './classes';

import * as astNodes from './astNodes';

// const transform2 = (transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
//   if ()
// };

const transform = (transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
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
  }

  throw new Error(`No transform found for '${rawAstNode.type}'`);
};

const evaluate = async (astNode: ASTNode, environment: Environment): Promise<KopiValue> => {
  if (astNode instanceof astNodes.NumericLiteral) {
    return new KopiNumber(astNode.value);
  } else if (astNode instanceof astNodes.BooleanLiteral) {
    return new KopiBoolean(astNode.value);
  } else if (astNode instanceof astNodes.StringLiteral) {
    return new KopiString(astNode.value);
  } else if (astNode instanceof astNodes.AstLiteral) {
    return astNode.value;
  } else if (astNode instanceof astNodes.Identifier) {
    const value = environment[astNode.name];

    if (astNode.name in environment && value !== undefined) {
      return value;
    }

    throw new Error(`Variable '${astNode.name}' not found in current scope`);
  } else {
    throw new Error(`No visitor found for '${inspect(astNode)}'`);
  }
};

export {
  transform,
  evaluate,
};
