import { addTraits, KopiValue } from "../../shared";

import { Enumerable } from "../../shared";
import Comparable from '../../operators/traits/KopiComparable';
import KopiIterable from "../../operators/traits/KopiIterable";

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";

class KopiString extends KopiValue {
  static emptyValue = () => new KopiString('');

  constructor(value: string, hasIterator = true) {
    super();

    this.value = value;

    if (!hasIterator) {
      delete (this as any)[Symbol.iterator];
      delete (this as any)[Symbol.asyncIterator];
    }
  }

  // Core methods

  override valueOf() {
    return this.value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  // *[Symbol.iterator]() {
  //   for (const value of this.value) {
  //     console.log('here');
  //     yield new KopiString(value);
  //   }
  // }

  // *[Symbol.asyncIterator]() {
  //   for (const value of this.value) {
  //     yield value;
  //   }
  // }

  size() {
    return new KopiNumber(this.value.length);
  }

  append(that: KopiString) {
    return new KopiString(this.value + that.value);
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

addTraits([Enumerable, Comparable, KopiIterable], KopiString);

export default KopiString;
