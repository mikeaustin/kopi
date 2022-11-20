import { inspect } from './utils';

abstract class KopiTrait { }

abstract class KopiNumeric extends KopiTrait {
  abstract '+'(that: KopiValue): KopiValue;
  abstract '-'(that: KopiValue): KopiValue;
  abstract '*'(that: KopiValue): KopiValue;
  abstract '/'(that: KopiValue): KopiValue;
  abstract '%'(that: KopiValue): KopiValue;
  abstract negate(): KopiValue;
}

abstract class KopiEquatable extends KopiTrait {
  abstract '=='(that: KopiValue): KopiValue;
}

abstract class KopiApplicative extends KopiTrait {
  abstract apply(
    thisArg: KopiValue | undefined,
    [argument, context]: [KopiValue, Context]
    // [argumentValue, evaluateNode, currentEnvironment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue>;
}

abstract class KopiEnumerable extends KopiTrait {
  abstract succ(count: KopiValue): KopiValue;
}

abstract class KopiBounded extends KopiTrait {
  abstract min(this: KopiValue): KopiValue;
  abstract max(this: KopiValue): KopiValue;
}

abstract class KopiCollection extends KopiTrait {
  static emptyValue(): KopiValue { return new KopiValue(); };
  abstract append(this: KopiCollection, that: Promise<KopiValue>): KopiValue;
}

// const $Comparable = ({
//   compare,
//   '<': lessThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) < 0,
//   '>': greaterThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) > 0,
// }: {
//   compare: (thisArg: KopiValue, that: KopiValue) => number,
//   '<'?: (thisArg: KopiValue, that: KopiValue) => boolean,
//   '>'?: (thisArg: KopiValue, that: KopiValue) => boolean,
// }) => class extends Comparable {
//     // compare(thisArg: KopiValue, that: KopiValue): number { return compare(thisArg, that); }
//     'compare' = compare;
//     '<' = lessThan;
//     '>' = greaterThan;
//   };

const addTraits = (traits: Function[], _constructor: Function) => {
  for (const trait of traits) {
    for (const name of Object.getOwnPropertyNames(trait.prototype)) {
      if (name !== 'constructor') {
        (_constructor.prototype as any)[name] = (trait.prototype as any)[name];
      }
    }

    (_constructor as any).traits = traits;
  }
};

//

class KopiValue {
  static traits: KopiTrait[] = [];

  async inspect() {
    return inspect(this);
  }

  get fields(): Promise<KopiValue>[] {
    return [Promise.resolve(this)];
  }

  // TODO: How to return Tuple: recursive import
  getFieldAt(index: number): Promise<KopiValue> | undefined {
    return index === 0 ? Promise.resolve(this) : undefined;
  }

  async toJS(): Promise<any> {
    return this;
  }

  async invoke(
    methodName: string,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment } = context;
    const functions = (environment._extensions as Extensions).map.get(this.constructor);

    const method = functions && functions[methodName]
      ? functions[methodName]
      : (this as any)[methodName];

    if (method) {
      return await method.apply(this, [argument, context]);
    }

    throw new Error(`No method '${methodName}' found in ${await this.inspect()}`);
  }
}

class ASTNode extends KopiValue {
  location: {} = {};

  constructor(location: {}) {
    super();

    // this.location = location;
  }

  override async inspect() {
    return inspect(this);
  }
}

abstract class ASTPatternNode extends ASTNode {
  abstract match(
    value: KopiValue,
    { evaluate, environment, bindValues }: Context,
  ): Promise<{ [name: string]: KopiValue; } | undefined>;
}

//

interface RawASTNode {
  [key: string]: any;
}

interface Bindings extends Promise<{
  [name: string]: KopiValue;
}> { }

type BindValues = (bindings: { [name: string]: KopiValue; }) => void;

type Transform = (rawAstNode: RawASTNode) => ASTNode;
type Evaluate = (astNode: ASTNode, environment: Environment, bindValues: BindValues) => Promise<KopiValue>;

interface Environment {
  [name: string | symbol]: KopiValue;
}

class Extensions extends KopiValue {
  map: Map<Function, { [name: string]: any; }>;

  constructor(mappings: [Function, { [name: string]: any; }][]) {
    super();

    this.map = new Map(mappings);
  }
}

type Context = {
  environment: Environment,
  evaluate: Evaluate,
  bindValues: BindValues,
};

export {
  ASTNode,
  ASTPatternNode,
  KopiTrait,
  KopiNumeric,
  KopiEquatable,
  KopiApplicative,
  KopiEnumerable,
  KopiCollection,
  KopiValue,
  Extensions,
  addTraits,
  type RawASTNode,
  type Bindings,
  type Transform,
  type Environment,
  type BindValues,
  type Evaluate,
  type Context,
};
