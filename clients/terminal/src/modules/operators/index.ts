import * as core from '../core';
import { KopiNumber } from '../terminals';

type AST<TAST> =
  | OperatorExpression<TAST>
  ;

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

// function evaluate<TAST, TValue extends KopiValue>(
//   astNode: TAST,
//   environment: {},
//   type?: { new(...args: any): TValue; }
// ): TValue {
//   let value;

//   switch (astNode.type) {
//     case 'OperatorExpression':
//       value = visitors[astNode.type](astNode, environment, evaluate);
//       break;
//     case 'NumericLiteral':
//       value = visitors[astNode.type](astNode, environment);
//       break;
//     case 'BooleanLiteral':
//       value = visitors[astNode.type](astNode, environment);
//       break;
//     default:
//       const exhaustiveCheck: never = astNode;
//       throw new Error();
//   }

//   if (type) {
//     if (value instanceof type) {
//       return value;
//     } else {
//       throw new Error(`Unexpected type ${type}`);
//     }
//   }

//   return value as unknown as TValue;
// }

// evaluate({
//   type: 'OperatorExpression',
//   op: '+',
//   left: { type: 'NumericLiteral', value: 2 },
//   right: { type: 'NumericLiteral', value: 3 },
// }, {}, evaluate);

export {
  type AST,
  visitors,
};
