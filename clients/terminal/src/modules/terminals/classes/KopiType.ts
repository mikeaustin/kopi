import { KopiValue, Context } from "../../shared";
import { KopiApplicative } from "../../shared";

class KopiType extends KopiValue {
  static override traits = [KopiApplicative];

  _class: any;

  constructor(_class: Function) {
    super();

    this._class = _class;
  }

  override async inspect() {
    return this._class.prototype.inspect.apply(undefined, []);
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return new this._class(argument);
  }
}

export default KopiType;
