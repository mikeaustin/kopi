import { KopiValue } from "../../shared";
import { Enumerable } from "../../shared";

import Comparable from '../../operators/traits/KopiComparable';

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";

class KopiString extends KopiValue {
  static override traits = [Enumerable, Comparable];

  constructor(value: string) {
    super();

    this.value = value;
  }

  // Core methods

  override valueOf() {
    return this.value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  // Enumerable methods

  succ(count: KopiNumber): KopiString {
    if (count instanceof KopiTuple && count.fields.length === 0) {
      count = new KopiNumber(1);
    }

    const codePoint = this.value.codePointAt(0);

    if (codePoint) {
      return new KopiString(String.fromCodePoint(codePoint + count.value));
    }

    throw new Error('KopiString.succ()');
  }

  // Comparable methods

  compare(that: KopiString) {
    if (this.value < that.value) {
      return new KopiNumber(-1);
    } else if (this.value > that.value) {
      return new KopiNumber(+1);
    }

    return new KopiNumber(0);
  }

  // General methods

  split(string: KopiString) {
    return new KopiArray(
      this.value.split(string.value).map(string => Promise.resolve(new KopiString(string)))
    );
  }

  value: string;
}

for (const name of Object.getOwnPropertyNames(Comparable.prototype)) {
  if (name !== 'constructor') {
    (KopiString.prototype as any)[name] = (Comparable.prototype as any)[name];
  }
}

export default KopiString;
