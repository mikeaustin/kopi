import * as core from '../core';
import { KopiNumber } from '../terminals';
import * as terminals from '../terminals';

type AST<TAST> =
  | OperatorExpression<TAST>
  ;

type Dummy = { type: 'Dummy', value: number; };

type OperatorExpression<TAST> = {
  type: 'OperatorExpression',
  op: '+' | '-';
  left: TAST,
  right: TAST,
};

interface KopiValue {
  inspect(): Promise<string>,
};

const visitors = {
  OperatorExpression<TAST>(
    { op, left, right }: OperatorExpression<TAST>,
    scope: {},
    evaluate: <T extends KopiValue>(ast: TAST, scope: {}, type?: { new(...arg: any): T; }) => T
  ) {
    const leftValue = evaluate(left, scope, KopiNumber);
    const rightValue = evaluate(right, scope, KopiNumber);

    // const foo = evaluate(right, scope, KopiNull);

    return new KopiNumber(leftValue.value + rightValue.value);
  }
};

function evaluate<TValue extends KopiValue>(
  astNode: AST<Dummy> | Dummy,
  environment: {},
  type?: { new(...args: any): TValue; }
): TValue {
  let value;

  switch (astNode.type) {
    case 'Dummy':
      value = new KopiNumber(5);
      break;
    case 'OperatorExpression':
      value = visitors[astNode.type](astNode, environment, evaluate);
      break;
    default:
      const exhaustiveCheck: never = astNode;
      throw new Error();
  }

  if (type) {
    if (value instanceof type) {
      return value;
    } else {
      throw new Error(`Unexpected type ${type}`);
    }
  }

  return value as unknown as TValue;
}

const value = evaluate({
  type: 'OperatorExpression',
  op: '+',
  left: { type: 'Dummy', value: 2 },
  right: { type: 'Dummy', value: 3 },
}, {});

console.log('operators', value);

export {
  type AST,
  visitors,
};
