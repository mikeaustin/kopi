import { ASTNode, ASTPatternNode, Bindings, KopiValue, KopiTrait, KopiApplicative, Context } from '../shared';
import { KopiBoolean, KopiNumber, KopiTuple } from './classes';

class NumericLiteral extends ASTNode {
  value: number;

  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }
}

class BooleanLiteral extends ASTNode {
  value: boolean;

  constructor({ value, location }: BooleanLiteral) {
    super(location);

    this.value = value;
  }
}

class StringLiteral extends ASTNode {
  value: string;

  constructor({ value, location }: StringLiteral) {
    super(location);

    this.value = value;
  }
}

class ArrayLiteral extends ASTNode {
  expressionElements: ASTNode[];

  constructor({ expressionElements, location }: ArrayLiteral) {
    super(location);

    this.expressionElements = expressionElements;
  }
}

class DictLiteral extends ASTNode {
  expressionEntries: [key: ASTNode, expression: ASTNode][];

  constructor({ expressionEntries, location }: DictLiteral) {
    super(location);

    this.expressionEntries = expressionEntries;
  }
}

class AstLiteral extends ASTNode {
  value: ASTNode;

  constructor({ value, location }: AstLiteral) {
    super(location);

    this.value = value;
  }
}

class Identifier extends ASTNode {
  static override traits: KopiTrait[] = [KopiApplicative];

  name: string;

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
    return argument.invoke(this.name, [new KopiTuple([]), context]);
  }
}

//
// Paterns
//

class NumericLiteralPattern extends ASTPatternNode {
  value: number;

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

class IdentifierPattern extends ASTPatternNode {
  name: string;
  defaultExpression: ASTNode | null;

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
  patterns: ASTPatternNode[];

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
        let matches = await pattern.match(await fields[index] ?? new KopiTuple([]), context);

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

class FunctionPattern extends ASTPatternNode {
  name: string;
  parameterPattern: ASTPatternNode;

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
  IdentifierPattern,
  TuplePattern,
  FunctionPattern,
};
