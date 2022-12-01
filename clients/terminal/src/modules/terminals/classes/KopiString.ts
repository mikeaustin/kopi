import { addTraits, KopiValue, KopiCollection, Context, KopiApplicative } from "../../shared";

import { KopiEnumerable } from "../../shared";
import Comparable from '../traits/KopiComparable';
import KopiIterable from "../traits/KopiIterable";

import KopiArray from "./KopiArray";
import KopiNumber from "./KopiNumber";
import KopiTuple from "./KopiTuple";
import KopiBoolean from "./KopiBoolean";
import KopiRange from "./KopiRange";
import KopiFunction from "./KopiFunction";

class KopiString extends KopiValue {
  static readonly emptyValue = () => new KopiString('');
  static readonly newlineRegExp = new KopiString(/\n/ as any);

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

  override async toString() {
    return `${this.value}`;
  }

  override async inspect() {
    return `"${this.toString()}"`;
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

  async apply(thisArg: KopiValue, [argument]: [KopiNumber]) {
    if (argument instanceof KopiArray) {
      const accum = [];
      const indices = argument;
      const array = [...this.value];

      for (const index of indices.elements) {
        accum.push(array[(await index as KopiNumber).value]);
      }

      return new KopiString(
        accum.join('')
      );
    }

    if (argument instanceof KopiRange) {
      const range = argument;
      const from = (range.from as KopiNumber);
      const to = (range.to as KopiNumber);

      const array = [...this.value].slice(
        from.value > to.value ? to.value : from.value,
        to.value < from.value ? from.value : to.value
      );

      if (from.value > to.value) {
        array.reverse();
      }

      return new KopiString(
        array.join('')
      );
    }

    if (argument instanceof KopiNumber) {
      const index = argument;

      const codePoint = this.value.codePointAt(index.value);

      if (codePoint) {
        return new KopiString(String.fromCodePoint(codePoint));
      }
    }

    throw new Error('Invalid codePoint');
  }

  set(argument: KopiNumber | KopiRange) {
    return (value: KopiString) => {
      const array = [...this.value];

      const start = argument instanceof KopiRange ? (argument.from as KopiNumber) : argument;
      const end = argument instanceof KopiRange ? (argument.to as KopiNumber) : new KopiNumber(argument.value + 1);

      // const deleteCount = to.value - from.value;
      // array.splice(from.value, deleteCount, value.value);

      // return new KopiString(
      //   array.join('')
      // );

      return new KopiString(
        array
          .slice(0, start.value)
          .concat(value.value)
          .concat(array.slice(end.value, Infinity))
          .join('')
      );
    };
  }

  update(index: KopiNumber, context: Context) {
    return async (func: KopiFunction) => {
      const array = [...this.value];
      const value = array[index.value] ?? '';

      const updatedValue = (await func.apply(KopiTuple.empty, [new KopiString(value), context]) as KopiString).value;

      array.splice(index.value, 1, updatedValue);

      return new KopiString(array.join(''));
    };
  }

  remove(index: KopiNumber) {
    const array = [...this.value];

    return new KopiString(
      array
        .slice(0, index.value)
        .concat(array.slice(index.value + 1, Infinity))
        .join('')
    );
  }

  async getTuple(tuple: KopiTuple) {
    const arg = await tuple.fields[0] as KopiNumber;
    const value = await tuple.fields[1] as KopiString;

    if (arg instanceof KopiRange) {
      const range = arg;
      const array = [...this.value];

      return new KopiString(
        array
          .slice(0, (range.from as KopiNumber).value)
          .concat(value.value)
          .concat(array.slice((range.to as KopiNumber).value, Infinity))
          .join('')
      );
    }

    if (arg instanceof KopiNumber) {
      const index = arg;
      const array = [...this.value];

      return new KopiString(
        array
          .slice(0, index.value)
          .concat(value.value)
          .concat(array.slice(index.value + 1, Infinity))
          .join('')
      );
    }

    throw new Error('');
  }

  async get(arg: KopiValue): Promise<KopiValue> {
    if (arg instanceof KopiTuple) {
      return this.getTuple(arg);
    }

    if (arg instanceof KopiArray) {
      const accum = [];
      const indices = arg;
      const array = [...this.value];

      for (const index of indices.elements) {
        accum.push(array[(await index as KopiNumber).value]);
      }

      return new KopiString(
        accum.join('')
      );
    }

    if (arg instanceof KopiRange) {
      const range = arg;
      const array = [...this.value];

      return new KopiString(
        array.slice((range.from as KopiNumber).value, (range.to as KopiNumber).value).join('')
      );
    }

    if (arg instanceof KopiNumber) {
      const index = arg;

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

  trim(string: KopiString) {
    return new KopiString(
      this.value.trim()
    );
  }
}

addTraits([KopiEnumerable, Comparable, KopiIterable, KopiCollection, KopiApplicative], KopiString);

export default KopiString;
