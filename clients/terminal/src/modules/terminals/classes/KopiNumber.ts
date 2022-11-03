import { KopiValue } from "../../shared";
import { Numeric, Equatable, Ordered } from "../../shared";

import KopiString from './KopiString';

class KopiNumber extends KopiValue {
  static override traits = [Numeric, Equatable, Ordered];

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  '+'(that: KopiNumber) {
    return new KopiNumber(this.value + that.value);
  }

  '*'(that: KopiNumber) {
    return new KopiNumber(this.value * that.value);
  }

  succ() {
    return new KopiNumber(this.value + 1);
  }

  //

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

  value: number;
}

export default KopiNumber;
