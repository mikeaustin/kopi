import { Evaluate, Environment, BindValues, Context } from '../shared';
import { KopiNumber, KopiBoolean, KopiString, KopiArray } from './classes';

import * as astNodes from './astNodes';
import KopiDict from './classes/KopiDict';

async function NumericLiteral(
  { value }: astNodes.NumericLiteral,
  context: Context,
) {
  return new KopiNumber(value);
}

async function BooleanLiteral(
  { value }: astNodes.BooleanLiteral,
  context: Context,
) {
  return new KopiBoolean(value);
}

async function StringLiteral(
  { value }: astNodes.StringLiteral,
  context: Context,
) {
  return new KopiString(value);
}

async function ArrayLiteral(
  { expressionElements }: astNodes.ArrayLiteral,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiArray(expressionElements.map((expression) => evaluate(expression, environment, bindValues)));
}

async function DictLiteral(
  { expressionEntries }: astNodes.DictLiteral,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiDict(expressionEntries.map(([key, expression]) => [key, evaluate(expression, environment, bindValues)]));
}

async function Identifier(
  astNode: astNodes.Identifier,
  context: Context,
) {
  const { environment } = context;

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
  ArrayLiteral,
  DictLiteral,
  Identifier
};
