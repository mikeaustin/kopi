import { RawASTNode, ASTNode, KopiValue, Transform, Environment, Evaluate, BindValues } from '../shared.js';
import * as astNodes from './astNodes.js';
declare const transformAst: (transformAst: Transform) => (rawAstNode: RawASTNode) => astNodes.RangeExpression | astNodes.NumericLiteral | astNodes.BooleanLiteral | astNodes.StringLiteral | astNodes.ArrayLiteral | astNodes.DictLiteral | astNodes.AstLiteral | astNodes.Identifier | astNodes.NumericLiteralPattern | astNodes.StringLiteralPattern | astNodes.BooleanLiteralPattern | astNodes.IdentifierPattern | astNodes.TupleLiteralPattern | astNodes.ArrayLiteralPattern | astNodes.FunctionPattern;
declare const evaluateAst: (evaluateAst: Evaluate) => (astNode: ASTNode, environment: Environment, bindValues: BindValues) => Promise<KopiValue>;
export { transformAst, evaluateAst, };
