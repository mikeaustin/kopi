import { addTraits, KopiValue } from "../../shared";
import { Enumerable } from "../../shared";

import Comparable from '../../operators/traits/KopiComparable';

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";

class KopiString extends KopiValue {
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

  succ(count: KopiNumber | KopiTuple): KopiString {
    if (count === KopiTuple.empty) {
      count = new KopiNumber(1);
    }

    if (count instanceof KopiNumber) {
      const codePoint = this.value.codePointAt(0);

      if (codePoint) {
        return new KopiString(String.fromCodePoint(codePoint + count.value));
      }
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

addTraits([Enumerable, Comparable], KopiString);

export default KopiString;
