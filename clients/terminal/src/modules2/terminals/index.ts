import { RawASTNode, ASTNode, KopiValue, Environment } from '../shared';
import { KopiNumber, KopiBoolean } from './classes';

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

  async apply(thisArg: KopiValue, [arg]: [KopiValue]): Promise<KopiValue> {
    return (arg as any)[this.name]();
  }

  name: string;
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
  }

  throw new Error(`No transform found for '${rawAstNode.type}'`);
};

const evaluate = async (astNode: ASTNode, environment: Environment): Promise<KopiValue> => {
  if (astNode instanceof NumericLiteral) {
    return new KopiNumber(astNode.value);
  } else if (astNode instanceof BooleanLiteral) {
    return new KopiBoolean(astNode.value);
  } else if (astNode instanceof AstLiteral) {
    return astNode.value;
  } else if (astNode instanceof Identifier) {
    if (!(astNode.name in environment)) {
      throw new Error(`Variable '${astNode.name}' not found in current scope`);
    }

    return environment[astNode.name];
  } else {
    throw new Error(`No visitor found for '${astNode.constructor.name}'`);
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
