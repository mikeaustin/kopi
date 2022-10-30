import { ASTNode, KopiValue, Evaluate, Numeric, Environment } from '../shared';
import { KopiTuple, KopiFunction } from '../terminals/classes';

import * as astNodes from './astNodes';

async function OperatorExpression(
  { operator, leftExpression, rightExpression }: astNodes.OperatorExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment),
    evaluate(rightExpression, environment),
  ]);

  if (leftValue.traits.includes(Numeric)) {
    if (operator === '+') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    } else if (operator === '*') {
      return (leftValue as unknown as Numeric)[operator](rightValue);
    }
  }

  throw new Error(`${leftValue} doesn't have a method '${operator}'`);
}

async function TupleExpression({ expressionElements }: astNodes.TupleExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  return new KopiTuple(
    expressionElements.map(expressionElement => evaluate(expressionElement, environment))
  );
}

async function FunctionExpression({ parameterPattern, bodyExpression }: astNodes.FunctionExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  return new KopiFunction(
    parameterPattern,
    bodyExpression,
    environment,
  );
}

async function ApplyExpression({ expression, argumentExpression }: astNodes.ApplyExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  const func = await evaluate(expression, environment);

  // TODO
  if ('apply' in func) {
    return (func as unknown as { apply(thisArg: KopiValue | undefined, [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]): Promise<KopiValue>; })
      .apply(undefined, [await evaluate(argumentExpression, environment), evaluate, environment]);
  }

  throw new Error(`No apply() method found`);
}

export {
  OperatorExpression,
  TupleExpression,
  FunctionExpression,
  ApplyExpression,
};
