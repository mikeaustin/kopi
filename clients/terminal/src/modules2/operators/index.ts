import { RawASTNode, ASTNode, KopiValue, Environment } from '../shared';
import { KopiFunction } from '../terminals/classes';

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
    default:
      return next(rawAstNode);
  }
};

const evaluate =
  (next: (astNode: ASTNode, environment: Environment) => KopiValue, evaluate: (astNode: ASTNode, environment: Environment) => KopiValue) =>
    (astNode: any, environment: Environment): KopiValue => {
      if (astNode instanceof OperatorExpression) {
        const leftValue = evaluate(astNode.leftExpression, environment);
        const rightValue = evaluate(astNode.rightExpression, environment);

        if (astNode.operator in leftValue) {
          return (leftValue as any)[astNode.operator](rightValue);
        } else {
          throw new Error(`${leftValue} doesn't have a method '${astNode.operator}'`);
        }
      } else if (astNode instanceof FunctionExpression) {
        return new KopiFunction(astNode.parameters, astNode.bodyExpression);
      } else {
        return next(astNode, environment);
      }
    };

export {
  transform,
  evaluate,
};
