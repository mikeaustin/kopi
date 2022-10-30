import { ASTNode, ASTPatternNode, Environment, Evaluate, KopiValue } from "../shared";
import { Numeric, Equatable } from "../shared";

class KopiNumber extends KopiValue {
  constructor(value: number) {
    super([Numeric, Equatable]);

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

  size() {
    return new KopiNumber(this.elements.length);
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

class NativeFunction<TArgument> extends KopiValue {
  constructor(
    name: string,
    argType: Function = KopiValue,
    func: (value: TArgument, evaluate: Evaluate, environment: Environment) => Promise<KopiValue>
  ) {
    super();

    this.name = name;
    this.argType = argType;
    this.func = func;
  }

  async apply(thisArg: KopiValue, [argument, evaluate, environment]: [TArgument, Evaluate, Environment]): Promise<KopiValue> {
    if (!(argument instanceof this.argType)) {
      throw new Error(`${this.name}() only accepts a ${this.argType} as an argument, not ${argument}`);
    }

    return this.func.apply(thisArg, [argument, evaluate, environment]);
  }

  name: string;
  argType: Function;
  func: (value: TArgument, evaluate: Evaluate, environment: Environment) => Promise<KopiValue>;
}

export {
  KopiNumber,
  KopiBoolean,
  KopiString,
  KopiTuple,
  KopiFunction,
  NativeFunction,
};
