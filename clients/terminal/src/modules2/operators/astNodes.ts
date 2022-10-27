import { ASTNode, ASTPatternNode, KopiValue } from '../shared';
import { Identifier } from '../terminals';

class OperatorExpression extends ASTNode {
  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  operator: string;
  leftExpression: ASTNode;
  rightExpression: ASTNode;
}

class TupleExpression extends ASTNode {
  constructor({ elements, location }: TupleExpression) {
    super(location);

    this.elements = elements;
  }

  elements: ASTNode[];
}

class ApplyExpression extends ASTNode {
  constructor({ expression, argument, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argument = argument;
  }

  async apply(thisArg: KopiValue, [arg]: [KopiValue]): Promise<KopiValue> {
    console.log('here');
    return (arg as any)[(this.expression as Identifier).name]();
  }

  expression: ASTNode;
  argument: ASTNode;
}

class FunctionExpression extends ASTNode {
  constructor({ parameterPattern, bodyExpression, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
  }

  parameterPattern: ASTPatternNode;
  bodyExpression: ASTNode;
}

export {
  OperatorExpression,
  TupleExpression,
  ApplyExpression,
  FunctionExpression,
};
