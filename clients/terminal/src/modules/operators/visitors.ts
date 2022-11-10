import { KopiValue, BindValues, Numeric, Applicative, Evaluate, Environment, Trait, Context } from '../shared';
import { KopiTuple, KopiFunction } from '../terminals/classes';
import { KopiRange } from './classes';

import * as astNodes from './astNodes';
import * as terminalAstNodes from '../terminals/astNodes';

declare global {
  interface FunctionConstructor {
    traits: Trait[];
  }
}

async function Assignment(
  { pattern, expression }: astNodes.Assignment,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  if (pattern instanceof terminalAstNodes.FunctionPattern) {
    expression = new astNodes.FunctionExpression({
      parameterPattern: pattern.parameterPattern,
      bodyExpression: expression,
      name: pattern.name,
    } as astNodes.FunctionExpression);
  }

  const expressionValue = await evaluate(expression, environment, bindValues);
  const patternMatches = await pattern.match(expressionValue, { evaluate, environment, bindValues });

  if (patternMatches && bindValues) {
    bindValues(patternMatches);
  }

  return new KopiTuple([]);
}

async function BlockExpression(
  { statements }: astNodes.BlockExpression,
  context: Context,
): Promise<KopiValue> {
  let { evaluate, environment } = context;

  const newEnvironment = {};

  Object.setPrototypeOf(newEnvironment, environment);

  environment = newEnvironment;

  const bindValues = (bindings: { [name: string]: KopiValue; }) => {
    const newEnvironment = { ...environment, ...bindings };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(environment));

    environment = newEnvironment;
  };

  return statements.reduce<Promise<KopiValue>>(async (result, statement) => (
    (await result, await evaluate(statement, environment, bindValues))
  ), Promise.resolve(new KopiTuple([])));
}

async function PipeExpression(
  { expression, methodName, argumentExpression }: astNodes.PipeExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  const expressionValue = await evaluate(expression, environment, bindValues);
  const argumentValue = argumentExpression ? await evaluate(argumentExpression, environment, bindValues) : new KopiTuple([]);

  return expressionValue.invoke(methodName, [argumentValue, context]);
}

async function OperatorExpression(
  { operator, leftExpression, rightExpression }: astNodes.OperatorExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment, bindValues),
    evaluate(rightExpression, environment, bindValues),
  ]);

  if ((leftValue.constructor as typeof KopiValue).traits.includes(Numeric)) {
    if (operator === '+' || operator === '-' || operator === '*' || operator === '/' || operator === '%') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    }
  }

  throw new Error(`${await leftValue.inspect()} doesn't have a method '${operator}'`);
}

async function MemberExpression(
  { expression, member }: astNodes.MemberExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  const expressionValue = await evaluate(expression, environment, bindValues);

  const value = expressionValue[member as keyof typeof expressionValue];

  if (value !== undefined) {
    return value;
  }

  throw new Error(`${await expression.inspect()} doesn't have a member '${member}'`);
}

async function UnaryExpression(
  { operator, argumentExpression }: astNodes.UnaryExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  const argumentValue = await evaluate(argumentExpression, environment, bindValues);

  if ((argumentValue.constructor as typeof KopiValue).traits.includes(Numeric)) {
    if (operator === '-') {
      return (argumentValue as unknown as Numeric).negate();
    }
  }

  throw new Error(`${await argumentValue.inspect()} doesn't have a method '${operator}'`);
}

async function TupleExpression(
  { expressionFields, expressionFieldNames }: astNodes.TupleExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiTuple(
    expressionFields.map(expressionField => evaluate(expressionField, environment, bindValues)),
    expressionFieldNames,
  );
}

async function FunctionExpression(
  { parameterPattern, bodyExpression, name }: astNodes.FunctionExpression,
  context: Context,
) {
  const { environment } = context;

  return new KopiFunction(
    parameterPattern,
    bodyExpression,
    environment,
    name,
  );
}

async function ApplyExpression(
  { expression, argumentExpression }: astNodes.ApplyExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  const func = await evaluate(expression, environment, bindValues);

  if ((func.constructor as typeof KopiValue).traits.includes(Applicative)) {
    return (func as unknown as Applicative).apply(
      undefined,
      [await evaluate(argumentExpression, environment, bindValues), context]
    );
  }

  throw new Error(`No Applicative.apply() method found for ${func.constructor.name}`);
}

async function RangeExpression(
  { from, to }: astNodes.RangeExpression,
  context: Context,
) {
  const { evaluate, environment, bindValues } = context;

  return new KopiRange(
    evaluate(from, environment, bindValues),
    evaluate(to, environment, bindValues)
  );
}

export {
  Assignment,
  PipeExpression,
  BlockExpression,
  OperatorExpression,
  MemberExpression,
  UnaryExpression,
  TupleExpression,
  FunctionExpression,
  ApplyExpression,
  RangeExpression,
};
