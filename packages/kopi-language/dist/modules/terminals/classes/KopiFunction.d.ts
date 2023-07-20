import { KopiValue, ASTNode, ASTPatternNode, Environment, Context } from '../../shared.js';
import { KopiApplicative } from '../../shared.js';
declare class KopiFunction extends KopiValue {
    static readonly traits: (typeof KopiApplicative)[];
    readonly parameterPattern: ASTPatternNode;
    readonly bodyExpression: ASTNode;
    readonly environment: Environment;
    readonly name?: string;
    constructor(parameterPattern: ASTPatternNode, bodyExpression: ASTNode, environment: Environment, name?: string);
    apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
export default KopiFunction;
