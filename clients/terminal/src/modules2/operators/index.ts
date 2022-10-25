import { ASTNode, KopiValue } from '../shared';

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

const transform = (next: (astNode: any) => ASTNode, transform: (astNode: any) => ASTNode) => (astNode: any): ASTNode => {
  switch (astNode.type) {
    case 'OperatorExpression':
      return new OperatorExpression({
        operator: astNode.operator,
        leftExpression: transform(astNode.leftExpression),
        rightExpression: transform(astNode.rightExpression),
        location: astNode.location,
      } as OperatorExpression);
    default:
      return next(astNode);
  }
};

const evaluate = (next: (astNode: ASTNode) => KopiValue, evaluate: (astNode: ASTNode) => KopiValue) => (astNode: any) => {
  if (astNode instanceof OperatorExpression) {
    const leftValue = evaluate(astNode.leftExpression);
    const rightValue = evaluate(astNode.rightExpression);

    if (astNode.operator in leftValue) {
      return (leftValue as any)[astNode.operator](rightValue);
    } else {
      throw new Error(`Trying to add non-numbers`);
    }
  } else {
    return next(astNode);
  }
};

export {
  transform,
  evaluate,
};
