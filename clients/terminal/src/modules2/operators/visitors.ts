import { KopiValue, Numeric, Applicative, Evaluate, Environment, Trait, inspect } from '../shared';
import { KopiTuple, KopiFunction, KopiNumber } from '../terminals/classes';

import * as astNodes from './astNodes';

declare global {
  interface FunctionConstructor {
    xtraits: Trait[];
  }
}

async function BlockExpression(
  { statements }: astNodes.BlockExpression,
  evaluate: Evaluate,
  environment: Environment,
): Promise<KopiValue> {
  return await statements.reduce<Promise<KopiValue>>(async (result, statement) => (
    (await result, await evaluate(statement, environment))
  ), Promise.resolve(new KopiTuple([])));
}

async function OperatorExpression(
  { operator, leftExpression, rightExpression }: astNodes.OperatorExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment),
    evaluate(rightExpression, environment),
  ]);

  if ((leftValue.constructor as typeof KopiValue).xtraits.includes(Numeric)) {
    if (operator === '+') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    } else if (operator === '*') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    }
  }

  throw new Error(`${await leftValue.inspect()} doesn't have a method '${operator}'`);
}

async function TupleExpression(
  { expressionElements }: astNodes.TupleExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiTuple(
    expressionElements.map(expressionElement => evaluate(expressionElement, environment))
  );
}

async function FunctionExpression(
  { parameterPattern, bodyExpression }: astNodes.FunctionExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiFunction(
    parameterPattern,
    bodyExpression,
    environment,
  );
}

async function ApplyExpression(
  { expression, argumentExpression }: astNodes.ApplyExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  const func = await evaluate(expression, environment);

  if ((func.constructor as typeof KopiValue).xtraits.includes(Applicative)) {
    return (func as unknown as Applicative).apply(
      undefined,
      [await evaluate(argumentExpression, environment), evaluate, environment]
    );
  }

  throw new Error(`No Applicative.apply() method found for ${func.constructor.name}`);
}

export {
  BlockExpression,
  OperatorExpression,
  TupleExpression,
  FunctionExpression,
  ApplyExpression,
};
