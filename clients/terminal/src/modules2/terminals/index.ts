import { ASTNode } from '../shared';

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

class KopiNumber {
  constructor(value: number) {
    this.value = value;
  }

  async toString() {
    return this.value;
  }

  '+'(that: KopiNumber) {
    return this.value + that.value;
  }

  value: number;
}

const transform = (astNode: any) => {
  switch (astNode.type) {
    case 'NumericLiteral':
      return new NumericLiteral({
        value: astNode.value,
        location: astNode.location,
      } as NumericLiteral);
    case 'BooleanLiteral':
      return new BooleanLiteral({
        value: astNode.value,
      } as BooleanLiteral);
  }

  throw new Error(`astNodesToClasses: Can't convert ${astNode.type}`);
};

const evaluate = (astNode: ASTNode) => {
  if (astNode instanceof NumericLiteral) {
    return new KopiNumber(astNode.value);
  } else if (astNode instanceof BooleanLiteral) {
    return astNode.value;
  } else {
    throw new Error(`No visitor found for ${astNode.constructor.name}`);
  }
};

export {
  transform,
  evaluate,
  NumericLiteral,
  BooleanLiteral,
  KopiNumber,
};
