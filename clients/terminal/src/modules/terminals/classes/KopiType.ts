import { KopiValue, Evaluate, Environment } from "../../shared";
import { Applicative } from "../../shared";

import KopiString from './KopiString';

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

export default KopiType;
