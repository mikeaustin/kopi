import { addTraits, KopiValue, KopiCollection } from "../../shared";

import { KopiEnumerable } from "../../shared";
import Comparable from '../../operators/traits/KopiComparable';
import KopiIterable from "../../operators/traits/KopiIterable";

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";
import KopiBoolean from "./KopiBoolean";
import { KopiRange } from "../../operators/classes";

class KopiString extends KopiValue {
  static readonly emptyValue = () => new KopiString('');

  readonly value: string;

  // static [Symbol.hasInstance](instance: KopiStringWithoutIterator) {
  //   return instance instanceof KopiString;
  // }

  constructor(value: string, withIterator = true) {
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

  override async toJS() {
    return this.value;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.value) {
      yield new KopiString(value);
    }
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  async get(index: KopiValue): Promise<KopiValue> {
    if (index instanceof KopiTuple) {
      return index;
    }

    if (index instanceof KopiRange) {
      return new KopiString(
        this.value.slice((index.from as KopiNumber).value, (index.to as KopiNumber).value)
      );
    }

    if (index instanceof KopiNumber) {
      const codePoint = this.value.codePointAt(index.value);

      if (codePoint) {
        return new KopiString(String.fromCodePoint(codePoint));
      }
    }

    throw new Error('Invalid codePoint');
  }

  append(that: KopiString) {
    return new KopiString(this.value + that.value);
  }

  '++'(that: KopiString) {
    return new KopiString(this.value.concat(that.value));
  }

  toUpperCase() {
    return new KopiString(this.value.toLocaleUpperCase());
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

  '=='(that: KopiString): KopiBoolean {
    return new KopiBoolean(this.value === that.value);
  }

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
}

addTraits([KopiEnumerable, Comparable, KopiIterable, KopiCollection], KopiString);

export default KopiString;
