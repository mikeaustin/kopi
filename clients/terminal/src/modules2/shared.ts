import { inspect } from './utils';

abstract class Trait { }

abstract class Numeric extends Trait {
  abstract '+'(that: KopiValue): KopiValue;
  abstract '*'(that: KopiValue): KopiValue;
}

abstract class Equatable extends Trait {
  abstract '=='(that: KopiValue): KopiValue;
}

abstract class Applicative extends Trait {
  abstract apply(
    thisArg: KopiValue | undefined,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
    // [argumentValue, evaluateNode, currentEnvironment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue>;
}

abstract class Comparable extends Trait {
  abstract compare(thisArg: KopiValue, that: KopiValue): number;
  abstract '<'(thisArg: KopiValue, that: KopiValue): boolean;
  abstract '>'(thisArg: KopiValue, that: KopiValue): boolean;
}

const $Comparable = ({
  compare,
  '<': lessThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) < 0,
  '>': greaterThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) > 0,
}: {
  compare: (thisArg: KopiValue, that: KopiValue) => number,
  '<'?: (thisArg: KopiValue, that: KopiValue) => boolean,
  '>'?: (thisArg: KopiValue, that: KopiValue) => boolean,
}) => class extends Comparable {
    // compare(thisArg: KopiValue, that: KopiValue): number { return compare(thisArg, that); }
    'compare' = compare;
    '<' = lessThan;
    '>' = greaterThan;
  };

//

interface Indexable {
  [name: string]: any;
}

abstract class KopiValue {
  static traits: Trait[] = [];

  async inspect() {
    return inspect(this);
  }

  async getElementAtIndex(index: number): Promise<KopiValue | undefined> {
    return index === 0 ? Promise.resolve(this) : undefined;
  }

  async force() {
    return this;
  }

  async invoke(
    methodName: string,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    const functions = (environment._extensions as Extensions).map.get(this.constructor);

    const method = functions && functions[methodName]
      ? functions[methodName]
      : (this as Indexable)[methodName];

    if (method) {
      return await method.apply(this, [argument, evaluate, environment]);
    }

    throw new Error(`No method ${methodName} found in ${this}`);
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
    value: KopiValue | undefined,
    evaluate: Evaluate,
    environment: Environment
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

type Evaluate = (astNode: ASTNode, environment: Environment) => Promise<KopiValue>;

interface Environment {
  [name: string]: KopiValue;
}

class Extensions extends KopiValue {
  constructor(mappings: [[Function, { [name: string]: any; }]]) {
    super();

    this.map = new Map(mappings);
  }

  map: Map<Function, { [name: string]: any; }>;
}

export {
  ASTNode,
  ASTPatternNode,
  Trait,
  Numeric,
  Equatable,
  Applicative,
  KopiValue,
  Extensions,
  type RawASTNode,
  type Bindings,
  type Transform,
  type Environment,
  type Evaluate,
};
