import { inspect } from './utils';

abstract class Trait { }

abstract class Numeric extends Trait {
  abstract '+'(that: KopiValue): KopiValue;
  abstract '-'(that: KopiValue): KopiValue;
  abstract '*'(that: KopiValue): KopiValue;
  abstract '/'(that: KopiValue): KopiValue;
  abstract '%'(that: KopiValue): KopiValue;
  abstract negate(): KopiValue;
}

abstract class Equatable extends Trait {
  abstract '=='(that: KopiValue): KopiValue;
}

abstract class Applicative extends Trait {
  abstract apply(
    thisArg: KopiValue | undefined,
    [argument, { evaluate, environment, bindValues }]: [KopiValue, Context]
    // [argumentValue, evaluateNode, currentEnvironment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue>;
}

abstract class Enumerable extends Trait {
  abstract succ(count: KopiValue): KopiValue;
}

abstract class Comparable extends Trait {
  abstract compare(this: KopiValue, that: KopiValue): KopiValue;
  abstract '<'(this: KopiValue, that: KopiValue): KopiValue;
  abstract '>'(this: KopiValue, that: KopiValue): KopiValue;
}

abstract class Bounded extends Trait {
  abstract min(this: KopiValue): KopiValue;
  abstract max(this: KopiValue): KopiValue;
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

//

interface Indexable {
  [name: string]: any;
}

abstract class KopiValue implements Indexable {
  static traits: Trait[] = [];

  async inspect() {
    return inspect(this);
  }

  // TODO: How to return Tuple: recursive import
  async getElementAtIndex(index: number): Promise<KopiValue | undefined> {
    return index === 0 ? Promise.resolve(this) : undefined;
  }

  async force(): Promise<KopiValue> {
    return this;
  }

  async invoke(
    methodName: string,
    [argument, { evaluate, environment, bindValues }]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const functions = (environment._extensions as Extensions).map.get(this.constructor);

    const method = functions && functions[methodName]
      ? functions[methodName]
      : (this as Indexable)[methodName];

    if (method) {
      return await method.apply(this, [argument, { evaluate, environment, bindValues }]);
    }

    throw new Error(`No method '${methodName}' found in ${await this.inspect()}`);
  }
}

class ASTNode extends KopiValue {
  constructor(location: {}) {
    super();

    // this.location = location;
  }

  override async inspect() {
    return inspect(this);
  }

  location: {} = {};
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

type Transform = (rawAstNode: RawASTNode) => ASTNode;

type Evaluate = (
  astNode: ASTNode,
  environment: Environment,
  bindValues: BindValues,
) => Promise<KopiValue>;

interface Environment {
  [name: string | symbol]: KopiValue;
}

type BindValues = (bindings: { [name: string]: KopiValue; }) => void;

class Extensions extends KopiValue {
  constructor(mappings: [[Function, { [name: string]: any; }]]) {
    super();

    this.map = new Map(mappings);
  }

  map: Map<Function, { [name: string]: any; }>;
}

type Context = {
  environment: Environment,
  evaluate: Evaluate,
  bindValues: BindValues,
};

export {
  ASTNode,
  ASTPatternNode,
  Trait,
  Numeric,
  Equatable,
  Applicative,
  Enumerable,
  Comparable,
  KopiValue,
  Extensions,
  type RawASTNode,
  type Bindings,
  type Transform,
  type Environment,
  type BindValues,
  type Evaluate,
  type Context,
};
