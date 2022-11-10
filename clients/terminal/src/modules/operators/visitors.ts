import { KopiValue, Bindings, Numeric, Applicative, Evaluate, Environment, Trait, ASTPatternNode } from '../shared';
import { KopiTuple, KopiFunction, KopiNumber } from '../terminals/classes';
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
  evaluate: Evaluate,
  environment: Environment,
  bindValues?: (bindings: { [name: string]: KopiValue; }) => void,
) {
  if (pattern instanceof terminalAstNodes.FunctionPattern) {
    expression = new astNodes.FunctionExpression({
      parameterPattern: pattern.parameterPattern,
      bodyExpression: expression,
      name: pattern.name,
    } as astNodes.FunctionExpression);
  }

  const expressionValue = await evaluate(expression, environment);
  const patternMatches = await pattern.match(expressionValue, evaluate, environment);

  if (patternMatches && bindValues) {
    bindValues(patternMatches);
  }

  return new KopiTuple([]);
}

async function BlockExpression(
  { statements }: astNodes.BlockExpression,
  evaluate: Evaluate,
  environment: Environment,
): Promise<KopiValue> {
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
  evaluate: Evaluate,
  environment: Environment,
) {
  const expressionValue = await evaluate(expression, environment);
  const argumentValue = argumentExpression ? await evaluate(argumentExpression, environment) : new KopiTuple([]);

  return expressionValue.invoke(methodName, [argumentValue, evaluate, environment]);
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

  if ((leftValue.constructor as typeof KopiValue).traits.includes(Numeric)) {
    if (operator === '+' || operator === '-' || operator === '*' || operator === '/' || operator === '%') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    }
  }

  throw new Error(`${await leftValue.inspect()} doesn't have a method '${operator}'`);
}

async function MemberExpression(
  { expression, member }: astNodes.MemberExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  const expressionValue = await evaluate(expression, environment);

  const value = expressionValue[member as keyof typeof expressionValue];

  if (value !== undefined) {
    return value;
  }

  throw new Error(`${await expression.inspect()} doesn't have a member '${member}'`);
}

async function UnaryExpression(
  { operator, argumentExpression }: astNodes.UnaryExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  const argumentValue = await evaluate(argumentExpression, environment);

  if ((argumentValue.constructor as typeof KopiValue).traits.includes(Numeric)) {
    if (operator === '-') {
      return (argumentValue as unknown as Numeric).negate();
    }
  }

  throw new Error(`${await argumentValue.inspect()} doesn't have a method '${operator}'`);
}

async function TupleExpression(
  { expressionFields, expressionFieldNames }: astNodes.TupleExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiTuple(
    expressionFields.map(expressionField => evaluate(expressionField, environment)),
    expressionFieldNames,
  );
}

async function FunctionExpression(
  { parameterPattern, bodyExpression, name }: astNodes.FunctionExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiFunction(
    parameterPattern,
    bodyExpression,
    environment,
    name,
  );
}

async function ApplyExpression(
  { expression, argumentExpression }: astNodes.ApplyExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  const func = await evaluate(expression, environment);

  if ((func.constructor as typeof KopiValue).traits.includes(Applicative)) {
    return (func as unknown as Applicative).apply(
      undefined,
      [await evaluate(argumentExpression, environment), evaluate, environment]
    );
  }

  throw new Error(`No Applicative.apply() method found for ${func.constructor.name}`);
}

async function RangeExpression(
  { from, to }: astNodes.RangeExpression,
  evaluate: Evaluate,
  environment: Environment,
) {
  return new KopiRange(
    evaluate(from, environment),
    evaluate(to, environment)
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
