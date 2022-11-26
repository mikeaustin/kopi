import { KopiValue } from "../../shared";

class KopiBoolean extends KopiValue {
  readonly value: boolean;

  constructor(value: boolean) {
    super();

    this.value = value;
  }

  override async inspect() {
    return this.value ? 'true' : 'false';
  }

  '!'(): KopiBoolean {
    return new KopiBoolean(!this.value);
  }

  '=='(that: KopiBoolean): KopiBoolean {
    return new KopiBoolean(this.value === that.value);
  }
}

export default KopiBoolean;
