import { KopiValue } from "../../shared";
import { Enumerable, Comparable } from "../../shared";

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";

class KopiString extends KopiValue {
  static override traits = [Enumerable, Comparable];

  constructor(value: string) {
    super();

    this.value = value;
  }

  override valueOf() {
    return this.value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  length() {
    return new KopiNumber(this.value.length);
  }

  split(string: KopiString) {
    return new KopiArray(
      this.value.split(string.value).map(string => Promise.resolve(new KopiString(string)))
    );
  }

  succ(count: KopiNumber): KopiString {
    if (count instanceof KopiTuple && count.elements.length === 0) {
      count = new KopiNumber(1);
    }

    const codePoint = this.value.codePointAt(0);

    if (codePoint) {
      return new KopiString(String.fromCodePoint(codePoint + count.value));
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
