declare abstract class KopiTrait {
}
declare abstract class KopiNumeric extends KopiTrait {
    abstract '+'(that: KopiValue): KopiValue;
    abstract '-'(that: KopiValue): KopiValue;
    abstract '*'(that: KopiValue): KopiValue;
    abstract '/'(that: KopiValue): KopiValue;
    abstract '%'(that: KopiValue): KopiValue;
    abstract negate(): KopiValue;
}
declare abstract class KopiEquatable extends KopiTrait {
    abstract '=='(that: KopiValue): KopiValue;
}
declare abstract class KopiApplicative extends KopiTrait {
    abstract apply(thisArg: KopiValue | undefined, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
declare abstract class KopiEnumerable extends KopiTrait {
    abstract succ(count: KopiValue): KopiValue;
}
declare abstract class KopiCollection extends KopiTrait {
    static emptyValue(): KopiValue;
    abstract append(this: KopiCollection, that: Promise<KopiValue>): KopiValue;
}
declare const addTraits: (traits: Function[], _constructor: Function) => void;
declare class KopiValue {
    static traits: KopiTrait[];
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    toJS(): Promise<any>;
    invoke(methodName: string, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
declare class ASTNode extends KopiValue {
    location: {};
    constructor(location: {});
    inspect(): Promise<string>;
}
declare abstract class ASTPatternNode extends ASTNode {
    abstract match(value: KopiValue, { environment, evaluateAst, bindValues }: Context): Promise<{
        [name: string]: KopiValue;
    } | undefined>;
}
interface RawASTNode {
    [key: string]: any;
}
interface Bindings extends Promise<{
    [name: string]: KopiValue;
}> {
}
declare type BindValues = (bindings: {
    [name: string]: KopiValue;
}) => void;
declare type Transform = (rawAstNode: RawASTNode) => ASTNode;
declare type Evaluate = (astNode: ASTNode, environment: Environment, bindValues: BindValues) => Promise<KopiValue>;
interface Environment {
    [name: string | symbol]: KopiValue;
}
declare class Extensions extends KopiValue {
    map: Map<Function, {
        [name: string]: any;
    }>;
    constructor(mappings: [Function, {
        [name: string]: any;
    }][]);
}
declare type Context = {
    environment: Environment;
    evaluateAst: Evaluate;
    bindValues: BindValues;
};
export { ASTNode, ASTPatternNode, KopiTrait, KopiNumeric, KopiEquatable, KopiApplicative, KopiEnumerable, KopiCollection, KopiValue, Extensions, addTraits, type RawASTNode, type Bindings, type Transform, type Environment, type BindValues, type Evaluate, type Context, };
