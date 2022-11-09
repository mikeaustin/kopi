import { ASTNode, ASTPatternNode, KopiValue } from '../shared';
import { Identifier } from '../terminals/astNodes';

class Assignment extends ASTNode {
  constructor({ pattern, expression, location }: Assignment) {
    super(location);

    this.pattern = pattern;
    this.expression = expression;
  }

  pattern: ASTPatternNode;
  expression: ASTNode;
}

class PipeExpression extends ASTNode {
  constructor({ expression, methodName, argumentExpression, location }: PipeExpression) {
    super(location);

    this.expression = expression;
    this.methodName = methodName;
    this.argumentExpression = argumentExpression;
  }

  expression: ASTNode;
  methodName: string;
  argumentExpression: ASTNode | null;
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

class MemberExpression extends ASTNode {
  constructor({ expression, member, location }: MemberExpression) {
    super(location);

    this.expression = expression;
    this.member = member;
  }

  expression: ASTNode;
  member: string;
}

class UnaryExpression extends ASTNode {
  constructor({ operator, argumentExpression, location }: UnaryExpression) {
    super(location);

    this.operator = operator;
    this.argumentExpression = argumentExpression;
  }

  operator: string;
  argumentExpression: ASTNode;
}

class TupleExpression extends ASTNode {
  constructor({ expressionElements, expressionElementNames, location }: TupleExpression) {
    super(location);

    this.expressionElements = expressionElements;
    this.expressionElementNames = expressionElementNames;
  }

  expressionElements: ASTNode[];
  expressionElementNames: string[];
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
  constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.name = name;
  }

  parameterPattern: ASTPatternNode;
  bodyExpression: ASTNode;
  name?: string;
}

class RangeExpression extends ASTNode {
  constructor({ from, to, location }: RangeExpression) {
    super(location);

    this.from = from;
    this.to = to;
  }

  from: ASTNode;
  to: ASTNode;
}

export {
  Assignment,
  PipeExpression,
  BlockExpression,
  OperatorExpression,
  MemberExpression,
  UnaryExpression,
  TupleExpression,
  ApplyExpression,
  FunctionExpression,
  RangeExpression,
};
