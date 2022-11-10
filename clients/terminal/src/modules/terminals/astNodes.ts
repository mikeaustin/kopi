import { ASTNode, ASTPatternNode, Bindings, KopiValue, Evaluate, Environment, BindValues, Trait, Applicative, Context } from '../shared';
import { KopiNumber, KopiTuple } from './classes';

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

class ArrayLiteral extends ASTNode {
  constructor({ expressionElements, location }: ArrayLiteral) {
    super(location);

    this.expressionElements = expressionElements;
  }

  expressionElements: ASTNode[];
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
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return argument.invoke(this.name, [new KopiTuple([]), context]);
  }

  name: string;
}

//
// Paterns
//

class NumericLiteralPattern extends ASTPatternNode {
  constructor({ value, location }: NumericLiteralPattern) {
    super(location);

    this.value = value;
  }

  override async match(number: KopiValue, context: Context) {
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

  override async match(value: KopiValue, context: Context) {
    const { evaluate, environment, bindValues } = context;

    if ((value === undefined || (value instanceof KopiTuple && value.elements.length === 0))) {
      if (this.defaultExpression !== null) {
        return {
          [this.name]: await evaluate(this.defaultExpression, environment, bindValues)
        };
      } else {
        return undefined;
      }
    }

    return {
      [this.name]: value
    };
  }

  name: string;
  defaultExpression: ASTNode | null;
}

class TuplePattern extends ASTPatternNode {
  constructor({ patterns, location }: TuplePattern) {
    super(location);

    this.patterns = patterns;
  }

  override async match(tuple: KopiValue, context: Context) {
    if (tuple === undefined) {
      throw new Error('TuplePattern match(): value is not a tuple');
    }

    try {
      let bindings = {} as Bindings;

      for (const [index, pattern] of this.patterns.entries()) {
        let matches = await pattern.match(await tuple.getElementAtIndex(index) ?? new KopiTuple([]), context);

        if (matches === undefined) {
          return undefined;
        }

        bindings = { ...bindings, ...matches };
      }

      return bindings;
    } catch (error) {
      throw Error('TuplePattern.match\n  ' + (error as Error).message);
    }
  }

  patterns: ASTPatternNode[];
}

class FunctionPattern extends ASTPatternNode {
  constructor({ name, parameterPattern, location }: FunctionPattern) {
    super(location);

    this.name = name;
    this.parameterPattern = parameterPattern;
  }

  override async match(value: KopiValue, context: Context) {
    return {
      [this.name]: value,
    };
  }

  name: string;
  parameterPattern: ASTPatternNode;
}

export {
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  ArrayLiteral,
  AstLiteral,
  Identifier,
  NumericLiteralPattern,
  IdentifierPattern,
  TuplePattern,
  FunctionPattern,
};
