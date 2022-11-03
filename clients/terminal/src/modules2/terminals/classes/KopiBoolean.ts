import { KopiValue } from "../../shared";

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

export default KopiBoolean;
