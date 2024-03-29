import { addTraits, KopiValue, KopiNumeric, KopiEquatable, KopiEnumerable } from '../../shared.js';
import Comparable from '../traits/KopiComparable.js';

import KopiString from './KopiString.js';
import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';

class KopiNumber extends KopiValue {
  static readonly PI: KopiNumber = new KopiNumber(Math.PI);
  static readonly E: KopiNumber = new KopiNumber(Math.E);

  // @ts-ignore
  static async inspect() {
    return `Number`;
  }

  static from(value: KopiString) {
    if (value instanceof KopiString) {
      return new KopiNumber(Number(value.value));
    }
  }

  //

  readonly value: number;

  //

  constructor(value: number) {
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
    return this.toString();
  }

  override async toJS() {
    return this.value;
  }

  // KopiNumeric methods

  '+'(that: KopiNumber) {
    return new KopiNumber(this.value + that.value);
  }

  '-'(that: KopiNumber) {
    return new KopiNumber(this.value - that.value);
  }

  '*'(that: KopiNumber) {
    return new KopiNumber(this.value * that.value);
  }

  '/'(that: KopiNumber) {
    return new KopiNumber(this.value / that.value);
  }

  '%'(that: KopiNumber) {
    return new KopiNumber(this.value % that.value);
  }

  negate() {
    return new KopiNumber(-this.value);
  }

  // Enumerable methods

  succ(count: KopiNumber) {
    if (count instanceof KopiTuple && count.fields.length === 0) {
      count = new KopiNumber(1);
    }

    return new KopiNumber(this.value + count.value);
  }

  // Comparable methods

  '=='(that: KopiNumber): KopiBoolean {
    return new KopiBoolean(this.value === that.value);
  }

  '!='(that: KopiNumber): KopiBoolean {
    return new KopiBoolean(this.value !== that.value);
  }

  compare(that: KopiNumber) {
    if (this.value < that.value) {
      return new KopiNumber(-1);
    } else if (this.value > that.value) {
      return new KopiNumber(+1);
    }

    return new KopiNumber(0);
  }

  // General methods

  even(): KopiBoolean {
    return new KopiBoolean(this.value % 2 === 0);
  }

  odd(): KopiBoolean {
    return new KopiBoolean(this.value % 2 !== 0);
  }

  round() {
    return new KopiNumber(Math.round(this.value));
  }

  sin() {
    return new KopiNumber(Math.sin(this.value));
  }

  cos() {
    return new KopiNumber(Math.cos(this.value));
  }

  toFixed(digits: KopiNumber) {
    return new KopiString(this.value.toFixed(digits.value));
  }

  test(a: KopiNumber) {
    return (b: KopiNumber) => new KopiNumber((this.value + a.value) * b.value);
  }
}

addTraits([KopiNumeric, KopiEquatable, KopiEnumerable, Comparable], KopiNumber);

export default KopiNumber;
