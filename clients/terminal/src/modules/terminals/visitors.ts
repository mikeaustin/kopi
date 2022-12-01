import { Context } from '../shared';
import { KopiNumber, KopiBoolean, KopiString, KopiArray, KopiRange } from './classes';

import * as astNodes from './astNodes';
import KopiDict from './classes/KopiDict';

async function RangeExpression(
  { from, to }: astNodes.RangeExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiRange(
    await evaluate(from, environment, bindValues),
    await evaluate(to, environment, bindValues)
  );
}

//

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

  return new KopiArray(
    expressionElements.map((expression) => evaluate(expression, environment, bindValues))
  );
}

async function DictLiteral(
  { expressionEntries }: astNodes.DictLiteral,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiDict(
    await Promise.all(expressionEntries.map(async ([key, expression]) => [
      await evaluate(key, environment, bindValues),
      evaluate(expression, environment, bindValues)
    ]))
  );
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
  RangeExpression,
  //
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  ArrayLiteral,
  DictLiteral,
  Identifier
};
