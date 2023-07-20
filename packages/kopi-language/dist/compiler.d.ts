import { RawASTNode, ASTNode, Environment, Context, BindValues, KopiTrait } from './modules/shared.js';
import { KopiValue } from './modules/shared.js';
import { KopiTuple } from './modules/terminals/classes/index.js';
import * as core from './functions/core.js';
declare global {
    interface FunctionConstructor {
        traits: KopiTrait[];
    }
    interface Function {
        inspect(): Promise<string>;
        get fields(): Promise<KopiValue>[];
        toJS(): Promise<KopiValue>;
        invoke(methodName: string, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
    }
}
declare const environment: {
    [name: string]: KopiValue;
};
declare const transformAst: (ast: RawASTNode) => ASTNode;
declare const evaluateAst: (ast: ASTNode, environment: Environment, bindValues: BindValues) => Promise<KopiValue>;
declare function interpret(source: string, kopi_print?: typeof core.kopi_print): Promise<KopiValue>;
declare const parse: (source: string) => ASTNode;
export { environment, parse, transformAst, evaluateAst, interpret, KopiValue, KopiTuple, };
