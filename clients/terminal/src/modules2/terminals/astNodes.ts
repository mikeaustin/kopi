import { ASTNode, ASTPatternNode, Bindings, KopiValue, Evaluate, Environment, Extensions, Trait, Applicative } from '../shared';
import { KopiNumber, KopiString, KopiTuple } from './classes';

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
  static override traits: Trait[] = [Applicative];

  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }

  async apply(
    thisArg: KopiValue,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    return argument.invoke(this.name, [new KopiTuple([]), evaluate, environment]);
  }

  name: string;
}

//

class NumericLiteralPattern extends ASTPatternNode {
  constructor({ value, location }: NumericLiteralPattern) {
    super(location);

    this.value = value;
  }

  override async match(number: KopiValue | undefined, evaluate: Evaluate, environment: Environment) {
    if (number instanceof KopiNumber && number.value === this.value) {
      return {} as Bindings;
    }

    return undefined;
  }

  value: number;
}

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

    return undefined;
    // throw new Error(`IdentifierPattern.match: No match found for pattern '${this.name}'`);
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
        // ...await pattern.match(await tuple.elements[index], evaluate, environment),
        ...await pattern.match(await tuple.getElementAtIndex(index), evaluate, environment),
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
  NumericLiteralPattern,
  IdentifierPattern,
  TuplePattern
};
