import * as core from '../core';
import * as terminals from '../terminals';

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
    evaluate: (ast: any, scope: {}) => any
  ) {
    const leftValue = evaluate(left, scope);
    const rightValue = evaluate(right, scope);

    return new terminals.KopiNumber(leftValue.value + rightValue.value);
  }
};

export {
  type AST,
  visitors,
};
