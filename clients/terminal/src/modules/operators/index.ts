import * as core from '../core';
import { KopiNumber } from '../terminals';

type AST =
  | OperatorExpression
  ;

type OperatorExpression = {
  type: 'OperatorExpression',
  op: '+' | '-';
  left: core.AST,
  right: core.AST,
};

const visitors = {
  OperatorExpression(
    { op, left, right }: OperatorExpression,
    scope: {},
    // evaluate: (ast: core.AST, scope: {}) => any
    evaluate: <T = any>(ast: core.AST, scope: {}, type: Function) => T
  ) {
    const leftValue = evaluate<KopiNumber>(left, scope, KopiNumber);
    const rightValue = evaluate<KopiNumber>(right, scope, KopiNumber);

    return new KopiNumber(leftValue.value + rightValue.value);
  }
};

export {
  type AST,
  visitors,
};
