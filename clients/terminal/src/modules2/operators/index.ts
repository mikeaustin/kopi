import { RawASTNode, ASTNode, KopiValue, Environment } from '../shared';

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

const transform = (next: (rawAstNode: RawASTNode) => ASTNode, transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: any): ASTNode => {
  switch (rawAstNode.type) {
    case 'OperatorExpression':
      return new OperatorExpression({
        operator: rawAstNode.operator,
        leftExpression: transform(rawAstNode.leftExpression),
        rightExpression: transform(rawAstNode.rightExpression),
        location: rawAstNode.location,
      } as OperatorExpression);
    default:
      return next(rawAstNode);
  }
};

const evaluate =
  (next: (astNode: ASTNode, environment: Environment) => KopiValue, evaluate: (astNode: ASTNode, environment: Environment) => KopiValue) =>
    (astNode: any, environment: Environment) => {
      if (astNode instanceof OperatorExpression) {
        const leftValue = evaluate(astNode.leftExpression, environment);
        const rightValue = evaluate(astNode.rightExpression, environment);

        if (astNode.operator in leftValue) {
          return (leftValue as any)[astNode.operator](rightValue);
        } else {
          throw new Error(`${leftValue} doesn't have a method '${astNode.operator}'`);
        }
      } else {
        return next(astNode, environment);
      }
    };

export {
  transform,
  evaluate,
};
