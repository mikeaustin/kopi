import { KopiValue } from "../../shared";
import { Enumerable, Comparable } from "../../shared";

import KopiNumber from "./KopiNumber";

class KopiString extends KopiValue {
  static override traits = [Enumerable, Comparable];

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

  succ(): KopiString {
    const codePoint = this.value.codePointAt(0);

    if (codePoint) {
      return new KopiString(String.fromCodePoint(codePoint + 1));
    }

    throw new Error('KopiString.succ()');
  }

  compare(that: KopiString) {
    if (this.value < that.value) {
      return new KopiNumber(-1);
    } else if (this.value > that.value) {
      return new KopiNumber(+1);
    }

    return new KopiNumber(0);
  }

  value: string;
}

export default KopiString;
