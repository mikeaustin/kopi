type AST =
  | NumericLiteral
  | BooleanLiteral
  ;

type NumericLiteral = { type: 'NumericLiteral', value: number; };
type BooleanLiteral = { type: 'BooleanLiteral', value: boolean; };

const visitors = {
  NumericLiteral({ value }: NumericLiteral, env?: {}) {
    return value;
  },
  // BooleanLiteral({ value }: BooleanLiteral, env?: {}) {
  //   return value;
  // }
};

function interpret(astNode: AST, scope: any): number {
  if (astNode.type === 'NumericLiteral') {
    return visitors[astNode.type](astNode, scope);
  } else {
    return -1;
    // throw new Error(`No ${this.constructor.name} AST visitor for '${astNode.constructor.name}'`);
  }
}

export {
  type AST,
  interpret
};
