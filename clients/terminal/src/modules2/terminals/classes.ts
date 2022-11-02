import { ASTNode, ASTPatternNode, Applicative, Environment, Evaluate, KopiValue } from "../shared";
import { Numeric, Equatable } from "../shared";

class KopiNumber extends KopiValue {
  static override traits = [Numeric, Equatable];

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  '+'(that: KopiNumber) {
    return new KopiNumber(this.value + that.value);
  }

  '*'(that: KopiNumber) {
    return new KopiNumber(this.value * that.value);
  }

  round() {
    return new KopiNumber(Math.round(this.value));
  }

  sin() {
    return new KopiNumber(Math.sin(this.value));
  }

  cos() {
    return new KopiNumber(Math.cos(this.value));
  }

  toFixed(digits: KopiNumber) {
    return new KopiString(this.value.toFixed(digits.value));
  }

  test(a: KopiNumber) {
    return (b: KopiNumber) => new KopiNumber((this.value + a.value) * b.value);
  }

  value: number;
}

class KopiBoolean extends KopiValue {
  constructor(value: boolean) {
    super();

    this.value = value;
  }

  override async inspect() {
    return this.value ? 'true' : 'false';
  }

  value: boolean;
}

class KopiType extends KopiValue {
  static override traits = [Applicative];

  constructor(type: Function) {
    super();

    this.type = type;
  }

  override async inspect() {
    return this.type.prototype.inspect.apply(undefined, []);
  }

  async apply(
    thisArg: KopiValue,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    return new KopiString("Hello, world");
  }

  type: Function;
}

class KopiString extends KopiValue {
  constructor(value: string) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  value: string;
}

class KopiTuple extends KopiValue {
  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `(${elements.join(', ')})`;
  }

  override async getElementAtIndex(index: number): Promise<KopiValue | undefined> {
    return this.elements[index];
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  elements: Promise<KopiValue>[];
}

class KopiFunction extends KopiValue {
  static override traits = [Applicative];

  constructor(parameterPattern: ASTPatternNode, bodyExpression: ASTNode, environment: Environment) {
    super();

    this.parameterPattern = parameterPattern;
    this.environment = environment;
    this.bodyExpression = bodyExpression;
  }

  async apply(
    thisArg: KopiValue,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    const matches = await this.parameterPattern.match(argument, evaluate, environment);

    return evaluate(this.bodyExpression, {
      ...this.environment,
      ...matches
    });
  }

  parameterPattern: ASTPatternNode;
  environment: Environment;
  bodyExpression: ASTNode;
}

export {
  KopiNumber,
  KopiBoolean,
  KopiType,
  KopiString,
  KopiTuple,
  KopiFunction,
};
