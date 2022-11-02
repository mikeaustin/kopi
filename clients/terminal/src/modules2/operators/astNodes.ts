import { ASTNode, ASTPatternNode, KopiValue } from '../shared';
import { Identifier } from '../terminals/astNodes';

class PipeExpression extends ASTNode {
  constructor({ expression, methodName, location }: PipeExpression) {
    super(location);

    this.expression = expression;
    this.methodName = methodName;
  }

  expression: ASTNode;
  methodName: string;
}

class BlockExpression extends ASTNode {
  constructor({ statements, location }: BlockExpression) {
    super(location);

    this.statements = statements;
  }

  statements: ASTNode[];
}

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
  constructor({ expressionElements, location }: TupleExpression) {
    super(location);

    this.expressionElements = expressionElements;
  }

  expressionElements: ASTNode[];
}

class ApplyExpression extends ASTNode {
  constructor({ expression, argumentExpression, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argumentExpression = argumentExpression;
  }

  async apply(thisArg: KopiValue, [argument]: [KopiValue]): Promise<KopiValue> {
    // TODO
    return (argument as any)[(this.expression as Identifier).name]();
  }

  expression: ASTNode;
  argumentExpression: ASTNode;
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
  PipeExpression,
  BlockExpression,
  OperatorExpression,
  TupleExpression,
  ApplyExpression,
  FunctionExpression,
};
