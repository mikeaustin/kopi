import { KopiValue, Evaluate, Environment } from '../shared';
import { KopiNumber, KopiBoolean, KopiString } from './classes';

import * as astNodes from './astNodes';

async function NumericLiteral(
  { value }: astNodes.NumericLiteral,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiNumber(value);
}

async function BooleanLiteral(
  { value }: astNodes.BooleanLiteral,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiBoolean(value);
}

async function StringLiteral(
  { value }: astNodes.StringLiteral,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiString(value);
}

async function Identifier(
  astNode: astNodes.Identifier,
  evaluate: Evaluate,
  environment: Environment,
) {
  const value = environment[astNode.name];

  if (astNode.name in environment && value !== undefined) {
    return value;
  }

  throw new Error(`Variable '${astNode.name}' not found in current scope`);
}

export {
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  Identifier
};
