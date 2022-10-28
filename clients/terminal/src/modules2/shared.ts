class RawASTNode {
  [key: string]: any;
}

abstract class Trait { }

abstract class Numeric extends Trait {
  abstract '+'(that: KopiValue): KopiValue;
  abstract '*'(that: KopiValue): KopiValue;
}

abstract class Equatable extends Trait {
  abstract '=='(that: KopiValue): KopiValue;
}

class KopiValue {
  constructor(traits = [] as Trait[]) {
    this.traits = traits;
  }

  async inspect() {
    return inspect(this);
  }

  async force() {
    return this;
  }

  traits: Trait[];
}

class ASTNode extends KopiValue {
  constructor(location: {}) {
    super();

    // this.location = location;
  }

  async inspect() {
    return inspect(this);
  }

  location: {} = {};
}

interface Bindings extends Promise<{
  [name: string]: KopiValue;
}> { }

type Evaluate = (astNode: ASTNode, environment: Environment) => Promise<KopiValue>;

abstract class ASTPatternNode extends ASTNode {
  abstract match(value: KopiValue): Promise<{ [name: string]: KopiValue; }>;
}

interface Environment {
  [name: string]: KopiValue;
}

const spaces = (level: number) => {
  return Array.from({ length: level }, _ => '  ').join('');
};

const inspect = (value: unknown, level: number = 0): string => {
  if (Array.isArray(value)) {
    const props = value.map((value) => `${spaces(level + 1)}${inspect(value, level + 1)}`);

    return value.length === 0
      ? `[]`
      : `[\n${props.join(',\n')}\n${spaces(level)}]`;
  }
  else if (typeof value === 'object') {
    const props = Object.entries(value ?? {}).map(
      ([name, value]) => `${spaces(level + 1)}${name}: ${inspect(value, level + 1)}`
    );

    return props.length === 0
      ? '{}'
      : `${value?.constructor.name} {\n${props.join(',\n')}\n${spaces(level)}}`;
  }

  return `${value}`;
};

export {
  RawASTNode,
  ASTNode,
  ASTPatternNode,
  Trait,
  Numeric,
  Equatable,
  KopiValue,
  type Bindings,
  type Environment,
  type Evaluate,
  inspect,
};
