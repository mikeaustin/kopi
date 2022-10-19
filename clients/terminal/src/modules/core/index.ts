import * as math from '../operators';

type AST =
  | Expression
  ;

type Expression =
  | math.AST
  ;

function interpret(astNode: AST, scope: any): number {
  return math.interpret(astNode, scope);
}

// function interpret2<T extends { type: string; }>(astNode: AST | T, scope: any): number {
//   return math.interpret(astNode, scope);
// }

export {
  type AST,
  type Expression,
  interpret,
  // interpret2,
};
