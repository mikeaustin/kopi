import { RawASTNode, ASTNode, ASTPatternNode, Bindings, KopiValue, Evaluate, Environment, inspect } from '../shared';

class NumericLiteral extends ASTNode {
  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }

  value: number;
}

class BooleanLiteral extends ASTNode {
  constructor({ value, location }: BooleanLiteral) {
    super(location);

    this.value = value;
  }

  value: boolean;
}

class StringLiteral extends ASTNode {
  constructor({ value, location }: StringLiteral) {
    super(location);

    this.value = value;
  }

  value: string;
}

class AstLiteral extends ASTNode {
  constructor({ value, location }: AstLiteral) {
    super(location);

    this.value = value;
  }

  value: ASTNode;
}

class Identifier extends ASTNode {
  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }

  async apply(thisArg: KopiValue, [argument]: [KopiValue]): Promise<KopiValue> {
    return (argument as any)[this.name]();
  }

  name: string;
}

//

class IdentifierPattern extends ASTPatternNode {
  constructor({ name, defaultExpression, location }: IdentifierPattern) {
    super(location);

    this.name = name;
    this.defaultExpression = defaultExpression;
  }

  override async match(value: KopiValue | undefined, evaluate: Evaluate, environment: Environment) {
    if (value !== undefined) {
      return {
        [this.name]: value
      };
    } else if (this.defaultExpression !== null) {
      return {
        [this.name]: await evaluate(this.defaultExpression, environment)
      };
    };

    throw new Error(`IdentifierPattern.match: No match found for pattern '${this.name}'`);
  }

  name: string;
  defaultExpression: ASTNode | null;
}

class TuplePattern extends ASTPatternNode {
  constructor({ patterns, location }: TuplePattern) {
    super(location);

    this.patterns = patterns;
  }

  override async match(tuple: KopiValue | undefined, evaluate: Evaluate, environment: Environment) {
    if (tuple === undefined) {
      throw new Error('TuplePattern match(): value is not a tuple');
    }

    try {
      return await this.patterns.reduce(async (bindings, pattern, index) => ({
        ...await bindings,
        ...await pattern.match(await tuple.elements[index], evaluate, environment),
      }), {} as Bindings);
    } catch (error) {
      throw Error('TuplePattern.match\n  ' + (error as Error).message);
    }
  }

  patterns: ASTPatternNode[];
}

export {
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  AstLiteral,
  Identifier,
  IdentifierPattern,
  TuplePattern
};
