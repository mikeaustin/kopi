import { RawASTNode, ASTNode, KopiValue, Transform, Evaluate, Environment, BindValues } from '../shared.js';
declare const transformAst: (next: Transform, transformAst: Transform) => (rawAstNode: RawASTNode) => ASTNode;
declare const evaluateAst: (next: Evaluate, evaluateAst: Evaluate) => (astNode: ASTNode, environment: Environment, bindValues: BindValues) => Promise<KopiValue>;
export { transformAst, evaluateAst, };
