import { ASTNode, ASTPatternNode, KopiValue } from '../shared';
import { Identifier } from '../terminals/astNodes';

class Assignment extends ASTNode {
  pattern: ASTPatternNode;
  expression: ASTNode;

  constructor({ pattern, expression, location }: Assignment) {
    super(location);

    this.pattern = pattern;
    this.expression = expression;
  }
}

class PipeExpression extends ASTNode {
  expression: ASTNode;
  methodName: string;
  argumentExpression: ASTNode | null;

  constructor({ expression, methodName, argumentExpression, location }: PipeExpression) {
    super(location);

    this.expression = expression;
    this.methodName = methodName;
    this.argumentExpression = argumentExpression;
  }
}

class BlockExpression extends ASTNode {
  statements: ASTNode[];

  constructor({ statements, location }: BlockExpression) {
    super(location);

    this.statements = statements;
  }
}

class OperatorExpression extends ASTNode {
  operator: string;
  leftExpression: ASTNode;
  rightExpression: ASTNode;

  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class MemberExpression extends ASTNode {
  expression: ASTNode;
  member: string;

  constructor({ expression, member, location }: MemberExpression) {
    super(location);

    this.expression = expression;
    this.member = member;
  }
}

class UnaryExpression extends ASTNode {
  operator: string;
  argumentExpression: ASTNode;

  constructor({ operator, argumentExpression, location }: UnaryExpression) {
    super(location);

    this.operator = operator;
    this.argumentExpression = argumentExpression;
  }
}

class TupleExpression extends ASTNode {
  expressionFields: ASTNode[];
  expressionFieldNames: string[];

  constructor({ expressionFields, expressionFieldNames, location }: TupleExpression) {
    super(location);

    this.expressionFields = expressionFields;
    this.expressionFieldNames = expressionFieldNames;
  }
}

class ApplyExpression extends ASTNode {
  expression: ASTNode;
  argumentExpression: ASTNode;

  constructor({ expression, argumentExpression, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argumentExpression = argumentExpression;
  }

  async apply(thisArg: KopiValue, [argument]: [KopiValue]): Promise<KopiValue> {
    // TODO
    return (argument as any)[(this.expression as Identifier).name]();
  }
}

class FunctionExpression extends ASTNode {
  parameterPattern: ASTPatternNode;
  bodyExpression: ASTNode;
  name?: string;

  constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.name = name;
  }
}

class RangeExpression extends ASTNode {
  from: ASTNode;
  to: ASTNode;

  constructor({ from, to, location }: RangeExpression) {
    super(location);

    this.from = from;
    this.to = to;
  }
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
