import { ASTNode, KopiValue } from "../shared";

class KopiNumber extends KopiValue {
  constructor(value: number) {
    super();

    this.value = value;
  }

  async inspect() {
    return `"${this.value}"`;
  }

  '+'(that: KopiNumber) {
    return new KopiNumber(this.value + that.value);
  }

  '*'(that: KopiNumber) {
    return new KopiNumber(this.value * that.value);
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
  constructor(elements: KopiValue[]) {
    super();

    this.elements = elements;
  }

  elements: KopiValue[];
}

class KopiFunction extends KopiValue {
  constructor(parameters: any[], bodyExpression: ASTNode) {
    super();

    this.parameters = parameters;
    this.bodyExpression = bodyExpression;
  }

  parameters: any[];
  bodyExpression: ASTNode;
}

export {
  KopiNumber,
  KopiBoolean,
  KopiTuple,
  KopiFunction,
};
