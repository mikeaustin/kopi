import { KopiValue } from "../../shared";

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

export default KopiString;
