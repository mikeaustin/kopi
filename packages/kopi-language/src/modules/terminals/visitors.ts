import { Context, KopiValue } from '../shared.js';
import { KopiNumber, KopiBoolean, KopiString, KopiArray, KopiRange } from './classes/index.js';

import * as astNodes from './astNodes.js';
import KopiDict from './classes/KopiDict.js';

async function RangeExpression(
  { from, to }: astNodes.RangeExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluateAst, bindValues } = context;

  return new KopiRange(
    await evaluateAst(from, environment, bindValues),
    await evaluateAst(to, environment, bindValues)
  );
}

//

async function NumericLiteral(
  { value }: astNodes.NumericLiteral,
  context: Context,
): Promise<KopiValue> {
  return new KopiNumber(value);
}

async function BooleanLiteral(
  { value }: astNodes.BooleanLiteral,
  context: Context,
): Promise<KopiValue> {
  return new KopiBoolean(value);
}

async function StringLiteral(
  { value }: astNodes.StringLiteral,
  context: Context,
): Promise<KopiValue> {
  return new KopiString(value);
}

async function ArrayLiteral(
  { expressionElements }: astNodes.ArrayLiteral,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluateAst, bindValues } = context;

  return new KopiArray(
    expressionElements.map((expression) => evaluateAst(expression, environment, bindValues))
  );
}

async function DictLiteral(
  { expressionEntries }: astNodes.DictLiteral,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluateAst, bindValues } = context;

  return new KopiDict(
    await Promise.all(expressionEntries.map(async ([key, expression]) => [
      await evaluateAst(key, environment, bindValues),
      evaluateAst(expression, environment, bindValues)
    ]))
  );
}

async function Identifier(
  astNode: astNodes.Identifier,
  context: Context,
): Promise<KopiValue> {
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
