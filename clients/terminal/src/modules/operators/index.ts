import * as core from '../core';
import { KopiNumber } from '../terminals';

type AST<TAST> =
  | OperatorExpression<TAST>
  ;

type OperatorExpression<TAST> = {
  type: 'OperatorExpression',
  op: '+' | '-';
  left: core.AST,
  right: core.AST,
};

interface KopiValue {
  inspect(): Promise<string>,
};

class KopiNull {
  async inspect() {
    return `<null>`;
  }
}

const visitors = {
  OperatorExpression<TAST>(
    { op, left, right }: OperatorExpression<TAST>,
    scope: {},
    evaluate: <T extends KopiValue>(ast: core.AST, scope: {}, type?: { new(...arg: any): T; }) => T
  ) {
    const leftValue = evaluate(left, scope, KopiNumber);
    const rightValue = evaluate(right, scope, KopiNumber);

    // const foo = evaluate(right, scope, KopiNull);

    return new KopiNumber(leftValue.value + rightValue.value);
  }
};

// function evaluate(
//   astNode: AST,
//   environment: {},
//   evaluate: <T extends KopiValue>(ast: core.AST, scope: {}, type?: { new(...arg: any): T; }) => T,
// ) {
//   switch (astNode.type) {
//     case 'OperatorExpression': {
//       return visitors[astNode.type](astNode, environment, evaluate);
//     }
//   }
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
