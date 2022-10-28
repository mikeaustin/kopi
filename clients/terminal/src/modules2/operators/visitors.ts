import { ASTNode, KopiValue, Evaluate, Environment } from '../shared';
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

  if (operator in leftValue) {
    return (leftValue as any)[operator](rightValue);
  }

  throw new Error(`${leftValue} doesn't have a method '${operator}'`);
}

async function TupleExpression({ elements }: astNodes.TupleExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  return new KopiTuple(
    elements.map(element => evaluate(element, environment))
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

async function ApplyExpression({ expression, argument }: astNodes.ApplyExpression,
  evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>,
  environment: Environment,
) {
  const func = await evaluate(expression, environment);

  // TODO
  if ('apply' in func) {
    return (func as unknown as { apply(thisArg: KopiValue | undefined, [argument, evaluate]: [KopiValue, Evaluate]): Promise<KopiValue>; })
      .apply(undefined, [await evaluate(argument, environment), evaluate]);
  }

  throw new Error(`No apply() method found`);
}

export {
  OperatorExpression,
  TupleExpression,
  FunctionExpression,
  ApplyExpression,
};
