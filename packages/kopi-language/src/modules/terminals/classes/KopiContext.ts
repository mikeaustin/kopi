import { KopiValue, Context, BindValues } from '../../../modules/shared.js';

class KopiContext extends KopiValue {
  constructor(value: KopiValue, bindValues: BindValues) {
    super();

    this.symbol = Symbol();
    this.value = value;

    bindValues({
      [this.symbol]: value,
    });
  }

  set(value: KopiValue, context: Context) {
    const { bindValues } = context;

    bindValues({
      [this.symbol]: value,
    });
  }

  get(value: KopiValue, context: Context) {
    const { environment } = context;

    return environment[this.symbol as keyof typeof environment];
  }

  symbol: symbol;
  value: KopiValue;
}

export default KopiContext;
