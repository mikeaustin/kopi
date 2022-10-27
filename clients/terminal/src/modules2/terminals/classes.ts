import { ASTNode, ASTPatternNode, Environment, KopiValue } from "../shared";

class KopiNumber extends KopiValue {
  constructor(value: number) {
    super();

    this.value = value;
  }

  async inspect() {
    return `${this.value}`;
  }

  '+'(that: KopiNumber) {
    return new KopiNumber(this.value + that.value);
  }

  '*'(that: KopiNumber) {
    return new KopiNumber(this.value * that.value);
  }

  sin() {
    return new KopiNumber(Math.sin(this.value));
  }

  cos() {
    return new KopiNumber(Math.cos(this.value));
  }

  value: number;
}

class KopiBoolean extends KopiValue {
  constructor(value: boolean) {
    super();

    this.value = value;
  }

  async inspect() {
    return this.value ? 'true' : 'false';
  }

  value: boolean;
}

class KopiTuple extends KopiValue {
  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `(${elements.join(', ')})`;
  }

  elements: Promise<KopiValue>[];
}

class KopiFunction extends KopiValue {
  constructor(parameterPattern: ASTPatternNode, bodyExpression: ASTNode, environment: Environment) {
    super();

    this.parameterPattern = parameterPattern;
    this.environment = environment;
    this.bodyExpression = bodyExpression;
  }

  async apply(thisArg: KopiValue, [argument]: KopiValue[], evaluate: (astNode: ASTNode, environment: Environment) => Promise<KopiValue>): Promise<KopiValue> {
    const matches = await this.parameterPattern.match(argument);

    return evaluate(this.bodyExpression, { ...this.environment, ...matches });
  }

  parameterPattern: ASTPatternNode;
  environment: Environment;
  bodyExpression: ASTNode;
}

export {
  KopiNumber,
  KopiBoolean,
  KopiTuple,
  KopiFunction,
};
