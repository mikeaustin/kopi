import { KopiValue } from "../../shared";

import KopiNumber from "./KopiNumber";

class KopiString extends KopiValue {
  constructor(value: string) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  length() {
    return new KopiNumber(this.value.length);
  }

  value: string;
}

export default KopiString;
