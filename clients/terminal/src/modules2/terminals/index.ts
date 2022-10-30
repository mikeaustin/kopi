import { Equals } from 'tsafe';
import { Evaluate } from '../shared';

import { AST } from '../../modules/terminals';

import { RawASTNode, ASTNode, ASTPatternNode, Bindings, KopiValue, Environment, inspect } from '../shared';
import { KopiNumber, KopiBoolean, KopiString, KopiTuple } from './classes';

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

  override async match(value: KopiValue | undefined, evaluate: Evaluate, environment: Environment) {
    if (value === undefined) {
      throw new Error('TuplePattern match(): value is not a tuple');
    }

    try {
      const tuple = value instanceof KopiTuple
        ? value
        : new KopiTuple([Promise.resolve(value)]);

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

//

const transform = (transform: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
  switch (rawAstNode.type) {
    case 'NumericLiteral':
      return new NumericLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as NumericLiteral);
    case 'BooleanLiteral':
      return new BooleanLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as BooleanLiteral);
    case 'StringLiteral':
      return new StringLiteral({
        value: rawAstNode.value,
        location: rawAstNode.location,
      } as StringLiteral);
    case 'AstLiteral':
      return new AstLiteral({
        value: transform(rawAstNode.value),
        location: rawAstNode.location,
      } as AstLiteral);
    case 'Identifier':
      return new Identifier({
        name: rawAstNode.name,
        location: rawAstNode.location,
      } as Identifier);
    case 'IdentifierPattern':
      return new IdentifierPattern({
        name: rawAstNode.name,
        location: rawAstNode.location,
        defaultExpression: rawAstNode.defaultExpression
          ? transform(rawAstNode.defaultExpression)
          : rawAstNode.defaultExpression,
      } as IdentifierPattern);
    case 'TuplePattern':
      return new TuplePattern({
        patterns: rawAstNode.patterns.map((pattern: ASTPatternNode) => transform(pattern)),
        location: rawAstNode.location,
      } as TuplePattern);
  }

  throw new Error(`No transform found for '${rawAstNode.type}'`);
};

const evaluate = async (astNode: ASTNode, environment: Environment): Promise<KopiValue> => {
  if (astNode instanceof NumericLiteral) {
    return new KopiNumber(astNode.value);
  } else if (astNode instanceof BooleanLiteral) {
    return new KopiBoolean(astNode.value);
  } else if (astNode instanceof StringLiteral) {
    return new KopiString(astNode.value);
  } else if (astNode instanceof AstLiteral) {
    return astNode.value;
  } else if (astNode instanceof Identifier) {
    const value = environment[astNode.name];

    if (astNode.name in environment && value !== undefined) {
      return value;
    }

    throw new Error(`Variable '${astNode.name}' not found in current scope`);
  } else {
    throw new Error(`No visitor found for '${inspect(astNode)}'`);
  }
};

export {
  transform,
  evaluate,
  Identifier,
  NumericLiteral,
  BooleanLiteral,
  KopiNumber,
};
