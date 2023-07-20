import { ASTNode, ASTPatternNode, Context, KopiTrait, KopiValue } from '../shared.js';
declare class Assignment extends ASTNode {
    readonly pattern: ASTPatternNode;
    readonly expression: ASTNode;
    constructor({ pattern, expression, location }: Assignment);
}
declare class PipeExpression extends ASTNode {
    readonly expression: ASTNode;
    readonly methodName: string;
    readonly argumentExpression: ASTNode | null;
    constructor({ expression, methodName, argumentExpression, location }: PipeExpression);
}
declare class BlockExpression extends ASTNode {
    readonly statements: ASTNode[];
    constructor({ statements, location }: BlockExpression);
}
declare class OperatorExpression extends ASTNode {
    readonly operator: string;
    readonly leftExpression: ASTNode;
    readonly rightExpression: ASTNode;
    constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression);
}
declare class MemberExpression extends ASTNode {
    readonly expression: ASTNode;
    readonly member: string;
    constructor({ expression, member, location }: MemberExpression);
}
declare class UnaryExpression extends ASTNode {
    readonly operator: string;
    readonly argumentExpression: ASTNode;
    constructor({ operator, argumentExpression, location }: UnaryExpression);
}
declare class TupleExpression extends ASTNode {
    readonly expressionFields: ASTNode[];
    readonly expressionFieldNames: string[];
    constructor({ expressionFields, expressionFieldNames, location }: TupleExpression);
}
declare class ApplyExpression extends ASTNode {
    static readonly traits: KopiTrait[];
    readonly expression: ASTNode;
    readonly argumentExpression: ASTNode;
    constructor({ expression, argumentExpression, location }: ApplyExpression);
    apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
declare class FunctionExpression extends ASTNode {
    readonly parameterPattern: ASTPatternNode;
    readonly bodyExpression: ASTNode;
    readonly name?: string;
    constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression);
}
export { Assignment, PipeExpression, BlockExpression, OperatorExpression, MemberExpression, UnaryExpression, TupleExpression, ApplyExpression, FunctionExpression, };
