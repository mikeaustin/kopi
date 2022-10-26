import { ASTNode, Environment, KopiValue } from "../shared";

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
  constructor(parameters: any[], bodyExpression: ASTNode, environment: Environment) {
    super();

    this.parameters = parameters;
    this.environment = environment;
    this.bodyExpression = bodyExpression;
  }

  apply(thisArg: KopiValue, arg: KopiValue, evaluate: (astNode: any, environment: any) => Promise<KopiValue>): Promise<KopiValue> {
    return evaluate(this.bodyExpression, this.environment);
  }

  parameters: any[];
  environment: Environment;
  bodyExpression: ASTNode;
}

export {
  KopiNumber,
  KopiBoolean,
  KopiTuple,
  KopiFunction,
};
