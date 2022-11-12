import { KopiValue, Context } from "../../shared";
import { Applicative } from "../../shared";

import KopiString from './KopiString';

class KopiType extends KopiValue {
  static override traits = [Applicative];

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

  _class: any;
}

export default KopiType;
