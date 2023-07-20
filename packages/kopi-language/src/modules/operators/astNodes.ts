import { ASTNode, ASTPatternNode, Context, KopiApplicative, KopiTrait, KopiValue } from '../shared.js';
import { Identifier } from '../terminals/astNodes.js';

class Assignment extends ASTNode {
  readonly pattern: ASTPatternNode;
  readonly expression: ASTNode;

  constructor({ pattern, expression, location }: Assignment) {
    super(location);

    this.pattern = pattern;
    this.expression = expression;
  }
}

class PipeExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly methodName: string;
  readonly argumentExpression: ASTNode | null;

  constructor({ expression, methodName, argumentExpression, location }: PipeExpression) {
    super(location);

    this.expression = expression;
    this.methodName = methodName;
    this.argumentExpression = argumentExpression;
  }
}

class BlockExpression extends ASTNode {
  readonly statements: ASTNode[];

  constructor({ statements, location }: BlockExpression) {
    super(location);

    this.statements = statements;
  }
}

class OperatorExpression extends ASTNode {
  readonly operator: string;
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class MemberExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly member: string;

  constructor({ expression, member, location }: MemberExpression) {
    super(location);

    this.expression = expression;
    this.member = member;
  }
}

class UnaryExpression extends ASTNode {
  readonly operator: string;
  readonly argumentExpression: ASTNode;

  constructor({ operator, argumentExpression, location }: UnaryExpression) {
    super(location);

    this.operator = operator;
    this.argumentExpression = argumentExpression;
  }
}

class TupleExpression extends ASTNode {
  readonly expressionFields: ASTNode[];
  readonly expressionFieldNames: string[];

  constructor({ expressionFields, expressionFieldNames, location }: TupleExpression) {
    super(location);

    this.expressionFields = expressionFields;
    this.expressionFieldNames = expressionFieldNames;
  }
}

class ApplyExpression extends ASTNode {
  static override readonly traits: KopiTrait[] = [KopiApplicative];

  readonly expression: ASTNode;
  readonly argumentExpression: ASTNode;

  constructor({ expression, argumentExpression, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argumentExpression = argumentExpression;
  }

  async apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue> {
    const { environment, evaluateAst, bindValues } = context;

    const identifier = this.expression as Identifier;
    const argumentValue = await evaluateAst(this.argumentExpression, environment, bindValues);

    return (argument as any)[identifier.name].apply(argument, [argumentValue, context]);
  }
}

class FunctionExpression extends ASTNode {
  readonly parameterPattern: ASTPatternNode;
  readonly bodyExpression: ASTNode;
  readonly name?: string;

  constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.name = name;
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
};
