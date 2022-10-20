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
    // evaluate: (ast: core.AST, scope: {}) => any
    evaluate: <T = any>(ast: core.AST, scope: {}) => T
  ) {
    const leftValue = evaluate<terminals.KopiNumber>(left, scope);
    const rightValue = evaluate<terminals.KopiNumber>(right, scope);

    return new terminals.KopiNumber(leftValue.value + rightValue.value);
  }
};

export {
  type AST,
  visitors,
};
