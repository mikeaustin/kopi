import { KopiValue, Context } from "../../shared";
import { KopiApplicative } from "../../shared";

class KopiType extends KopiValue {
  static override traits = [KopiApplicative];

  _constructor: any;

  constructor(_constructor: Function) {
    super();

    this._constructor = _constructor;
  }

  override async inspect() {
    return this._constructor.prototype.inspect.apply(undefined, []);
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return new this._constructor(argument);
  }
}

export default KopiType;
