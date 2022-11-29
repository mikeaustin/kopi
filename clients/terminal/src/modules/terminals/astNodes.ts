import { ASTNode, ASTPatternNode, Bindings, KopiValue, KopiTrait, KopiApplicative, Context } from '../shared';
import { KopiArray, KopiBoolean, KopiNumber, KopiString, KopiTuple } from './classes';

class NumericLiteral extends ASTNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }
}

class BooleanLiteral extends ASTNode {
  readonly value: boolean;

  constructor({ value, location }: BooleanLiteral) {
    super(location);

    this.value = value;
  }
}

class StringLiteral extends ASTNode {
  readonly value: string;

  constructor({ value, location }: StringLiteral) {
    super(location);

    this.value = value;
  }
}

class ArrayLiteral extends ASTNode {
  readonly expressionElements: ASTNode[];

  constructor({ expressionElements, location }: ArrayLiteral) {
    super(location);

    this.expressionElements = expressionElements;
  }
}

class DictLiteral extends ASTNode {
  readonly expressionEntries: [key: ASTNode, expression: ASTNode][];

  constructor({ expressionEntries, location }: DictLiteral) {
    super(location);

    this.expressionEntries = expressionEntries;
  }
}

class AstLiteral extends ASTNode {
  readonly value: ASTNode;

  constructor({ value, location }: AstLiteral) {
    super(location);

    this.value = value;
  }
}

class Identifier extends ASTNode {
  static override readonly traits: KopiTrait[] = [KopiApplicative];

  readonly name: string;

  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }

  '=='(that: Identifier): KopiBoolean {
    return new KopiBoolean(this.name === that.name);
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return argument.invoke(this.name, [KopiTuple.empty, context]);
  }
}

//
// Paterns
//

class NumericLiteralPattern extends ASTPatternNode {
  readonly value: number;

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
}

class StringLiteralPattern extends ASTPatternNode {
  readonly value: string;

  constructor({ value, location }: StringLiteralPattern) {
    super(location);

    this.value = value;
  }

  override async match(string: KopiValue, context: Context) {
    if (string instanceof KopiString && string.value === this.value) {
      return {} as Bindings;
    }

    return undefined;
  }
}

class BooleanLiteralPattern extends ASTPatternNode {
  readonly value: boolean;

  constructor({ value, location }: BooleanLiteralPattern) {
    super(location);

    this.value = value;
  }

  override async match(boolean: KopiValue, context: Context) {
    if (boolean instanceof KopiBoolean && boolean.value === this.value) {
      return {} as Bindings;
    }

    return undefined;
  }
}

class IdentifierPattern extends ASTPatternNode {
  readonly name: string;
  readonly defaultExpression: ASTNode | null;

  constructor({ name, defaultExpression, location }: IdentifierPattern) {
    super(location);

    this.name = name;
    this.defaultExpression = defaultExpression;
  }

  override async match(value: KopiValue, context: Context) {
    const { evaluate, environment, bindValues } = context;

    if ((value === undefined || (value === KopiTuple.empty))) {
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
}

class TuplePattern extends ASTPatternNode {
  readonly patterns: ASTPatternNode[];

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
      const fields = tuple.fields;

      for (const [index, pattern] of this.patterns.entries()) {
        let matches = await pattern.match(await fields[index] ?? KopiTuple.empty, context);

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
}

class ArrayPattern extends ASTPatternNode {
  readonly patterns: ASTPatternNode[];

  constructor({ patterns, location }: ArrayPattern) {
    super(location);

    this.patterns = patterns;
  }

  override async match(tuple: KopiArray, context: Context) {
    if (tuple === undefined) {
      throw new Error('ArrayPattern match(): value is not an array');
    }

    try {
      let bindings = {} as Bindings;

      for (const [index, pattern] of this.patterns.entries()) {
        let matches = await pattern.match(await tuple.elements[index] ?? KopiTuple.empty, context);

        if (matches === undefined) {
          return undefined;
        }

        bindings = { ...bindings, ...matches };
      }

      return bindings;
    } catch (error) {
      throw Error('ArrayPattern.match\n  ' + (error as Error).message);
    }
  }
}

class FunctionPattern extends ASTPatternNode {
  readonly name: string;
  readonly parameterPattern: ASTPatternNode;

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
}

export {
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  ArrayLiteral,
  DictLiteral,
  AstLiteral,
  Identifier,
  NumericLiteralPattern,
  StringLiteralPattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  TuplePattern,
  ArrayPattern,
  FunctionPattern,
};
