import { KopiValue } from "../../shared";

class KopiBoolean extends KopiValue {
  value: boolean;

  constructor(value: boolean) {
    super();

    this.value = value;
  }

  override async inspect() {
    return this.value ? 'true' : 'false';
  }
}

export default KopiBoolean;
