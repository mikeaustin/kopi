import * as core from '../core';
import * as next from '../terminals';

type AST =
  | OperatorExpression
  | next.AST
  ;

type OperatorExpression = {
  type: 'OperatorExpression',
  op: '+' | '-';
  left: core.Expression,
  right: core.Expression,
};

const visitors = {
  OperatorExpression({ op, left, right }: OperatorExpression, scope: {}): number {
    const leftValue = core.interpret(left, scope);
    const rightValue = core.interpret(right, scope);

    return leftValue + rightValue;
  }
};

function interpret(astNode: AST, scope: any): number {
  if (astNode.type === 'OperatorExpression') {
    return visitors[astNode.type](astNode, scope);
  } else {
    return next.interpret(astNode, scope);
  }
}

export {
  type AST,
  interpret
};
