type AST =
  | NumericLiteral
  | BooleanLiteral
  ;

type NumericLiteral = { type: 'NumericLiteral', value: number; };
type BooleanLiteral = { type: 'BooleanLiteral', value: boolean; };

class KopiNumber {
  constructor(value: number) {
    this.value = value;
  }

  async inspect() {
    return `${this.value}`;
  }

  value: number;
}

class KopiBoolean {
  constructor(value: boolean) {
    this.value = value;
  }

  async inspect() {
    return `${this.value}`;
  }

  value: boolean;
}

const visitors = {
  NumericLiteral({ value }: NumericLiteral, env?: {}) {
    return new KopiNumber(value);
  },
  BooleanLiteral({ value }: BooleanLiteral, env?: {}) {
    return new KopiBoolean(value);
  }
};

export {
  type AST,
  type NumericLiteral,
  type BooleanLiteral,
  visitors,
  KopiNumber,
  KopiBoolean,
};
