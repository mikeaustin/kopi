import { env } from 'process';
import { RawASTNode, ASTNode, KopiValue, Environment } from '../shared';
import { KopiTuple, KopiFunction, KopiNumber } from '../terminals/classes';

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

  expression: ASTNode;
  argument: ASTNode;
}

class FunctionExpression extends ASTNode {
  constructor({ parameters, bodyExpression, location }: FunctionExpression) {
    super(location);

    this.parameters = parameters;
    this.bodyExpression = bodyExpression;
  }

  parameters: any[];
  bodyExpression: ASTNode;
}

const transform = (next: (rawAstNode: RawASTNode) => ASTNode, transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: any): ASTNode => {
  switch (rawAstNode.type) {
    case 'OperatorExpression':
      return new OperatorExpression({
        operator: rawAstNode.operator,
        leftExpression: transform(rawAstNode.leftExpression),
        rightExpression: transform(rawAstNode.rightExpression),
        location: rawAstNode.location,
      } as OperatorExpression);
    case 'FunctionExpression':
      return new FunctionExpression({
        parameters: rawAstNode.parameters,
        bodyExpression: transform(rawAstNode.bodyExpression),
        location: rawAstNode.location,
      } as FunctionExpression);
    case 'TupleExpression':
      return new TupleExpression({
        elements: rawAstNode.elements.map((element: ASTNode) => transform(element)),
        location: rawAstNode.location,
      } as TupleExpression);
    case 'ApplyExpression':
      return new ApplyExpression({
        expression: transform(rawAstNode.expression),
        argument: transform(rawAstNode.argument),
        location: rawAstNode.location,
      } as ApplyExpression);
    default:
      return next(rawAstNode);
  }
};

const evaluate =
  (next: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>, evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>) =>
    async (astNode: any, environment: Environment): Promise<KopiValue> => {
      if (astNode instanceof OperatorExpression) {
        const [leftValue, rightValue] = await Promise.all([
          evaluate(astNode.leftExpression, environment),
          evaluate(astNode.leftExpression, environment),
        ]);

        if (astNode.operator in leftValue) {
          return (leftValue as any)[astNode.operator](rightValue);
        } else {
          throw new Error(`${leftValue} doesn't have a method '${astNode.operator}'`);
        }
      } else if (astNode instanceof TupleExpression) {
        return new KopiTuple(astNode.elements.map(element => evaluate(element, environment)));
      } else if (astNode instanceof FunctionExpression) {
        return new KopiFunction(astNode.parameters, astNode.bodyExpression, environment);
      } else if (astNode instanceof ApplyExpression) {
        const func = await evaluate(astNode.expression, environment);

        if ('apply' in func) {
          return (func as unknown as { apply(thisArg: KopiValue | undefined, args: KopiValue[], evaluate: any): Promise<KopiValue>; })
            .apply(undefined, [await evaluate(astNode.argument, environment)], evaluate);
        } else {
          throw new Error(`No apply() method found`);
        }
      } else {
        return next(astNode, environment);
      }
    };

export {
  transform,
  evaluate,
};
