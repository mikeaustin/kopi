import { ASTNode, ASTPatternNode, KopiValue, KopiTrait, Context } from '../shared.js';
import { KopiArray, KopiBoolean, KopiTuple } from './classes/index.js';
declare class RangeExpression extends ASTNode {
    readonly from: ASTNode;
    readonly to: ASTNode;
    constructor({ from, to, location }: RangeExpression);
}
declare class NumericLiteral extends ASTNode {
    readonly value: number;
    constructor({ value, location }: NumericLiteral);
}
declare class BooleanLiteral extends ASTNode {
    readonly value: boolean;
    constructor({ value, location }: BooleanLiteral);
}
declare class StringLiteral extends ASTNode {
    readonly value: string;
    constructor({ value, location }: StringLiteral);
}
declare class ArrayLiteral extends ASTNode {
    readonly expressionElements: ASTNode[];
    constructor({ expressionElements, location }: ArrayLiteral);
}
declare class DictLiteral extends ASTNode {
    readonly expressionEntries: [key: ASTNode, expression: ASTNode][];
    constructor({ expressionEntries, location }: DictLiteral);
}
declare class AstLiteral extends ASTNode {
    readonly value: ASTNode;
    constructor({ value, location }: AstLiteral);
}
declare class Identifier extends ASTNode {
    static readonly traits: KopiTrait[];
    readonly name: string;
    constructor({ name, location }: Identifier);
    '=='(that: Identifier): KopiBoolean;
    apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
declare class NumericLiteralPattern extends ASTPatternNode {
    readonly value: number;
    constructor({ value, location }: NumericLiteralPattern);
    match(number: KopiValue, context: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
declare class StringLiteralPattern extends ASTPatternNode {
    readonly value: string;
    constructor({ value, location }: StringLiteralPattern);
    match(string: KopiValue, context: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
declare class BooleanLiteralPattern extends ASTPatternNode {
    readonly value: boolean;
    constructor({ value, location }: BooleanLiteralPattern);
    match(boolean: KopiValue, context: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
declare class IdentifierPattern extends ASTPatternNode {
    readonly name: string;
    readonly defaultExpression: ASTNode | null;
    constructor({ name, defaultExpression, location }: IdentifierPattern);
    match(value: KopiValue, context: Context): Promise<{
        [x: string]: KopiValue;
    } | undefined>;
}
declare class TupleLiteralPattern extends ASTPatternNode {
    readonly patterns: ASTPatternNode[];
    constructor({ patterns, location }: TupleLiteralPattern);
    match(tuple: KopiValue, context: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
declare class ArrayLiteralPattern extends ASTPatternNode {
    readonly patterns: ASTPatternNode[];
    readonly defaultExpression: ASTNode | null;
    constructor({ patterns, defaultExpression, location }: ArrayLiteralPattern);
    match(array: KopiArray | KopiTuple, context: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
declare class FunctionPattern extends ASTPatternNode {
    readonly name: string;
    readonly parameterPattern: ASTPatternNode;
    constructor({ name, parameterPattern, location }: FunctionPattern);
    match(value: KopiValue, context: Context): Promise<{
        [x: string]: KopiValue;
    }>;
}
export { RangeExpression, NumericLiteral, BooleanLiteral, StringLiteral, ArrayLiteral, DictLiteral, AstLiteral, Identifier, NumericLiteralPattern, StringLiteralPattern, BooleanLiteralPattern, IdentifierPattern, TupleLiteralPattern, ArrayLiteralPattern, FunctionPattern, };
