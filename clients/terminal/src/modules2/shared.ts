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

abstract class KopiValue {
  constructor(traits = [] as Trait[]) {
    this.traits = traits;
    this.elements = [Promise.resolve(this)];
  }

  async inspect() {
    return inspect(this);
  }

  async force() {
    return this;
  }

  traits: Trait[];
  elements: Promise<KopiValue>[];
}

class ASTNode extends KopiValue {
  constructor(location: {}) {
    super([Applicative]);

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
  ): Promise<{ [name: string]: KopiValue; }>;
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

export {
  ASTNode,
  ASTPatternNode,
  Trait,
  Numeric,
  Equatable,
  Applicative,
  KopiValue,
  type RawASTNode,
  type Bindings,
  type Transform,
  type Environment,
  type Evaluate,
};
