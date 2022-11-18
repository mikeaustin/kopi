import { addTraits, KopiValue, KopiMonoid } from "../../shared";
import { Applicative, Enumerable } from "../../shared";

import { KopiArray, KopiBoolean, KopiNumber } from '../../terminals/classes';

import KopiIterable from '../traits/KopiIterable';
import Comparable from '../traits/KopiComparable';

const assertTrait = async (value: KopiValue, variableName: string, traits: Function[], errors: string[]) => {
  for (const trait of traits) {
    const constructorTraits = (value.constructor as typeof KopiValue).traits;

    if (!constructorTraits.includes(trait)) {
      errors.push(`'${variableName}' value '${await value.inspect()}' is missing trait '${trait.constructor.name}'`);
    }
  }
};

class KopiRange extends KopiValue {
  static emptyValue = () => new KopiArray([]);

  constructor(from: KopiValue, to: KopiValue, stride?: KopiNumber) {
    super();

    this.from = from;
    this.to = to;
    this.stride = stride ?? new KopiNumber(1);
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  // Applicatie methods

  async apply(thisArg: KopiValue, [by]: [KopiNumber]) {
    return new KopiRange(this.from, this.to, by);
  }

  // Iterator methods

  async *[Symbol.asyncIterator]() {
    let errors: string[] = [];

    assertTrait(this.from, 'from', [Enumerable, Comparable], errors);
    assertTrait(this.to, 'to', [Enumerable, Comparable], errors);

    if (errors.length > 0) {
      throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
    }

    for (
      let current = this.from;
      ((current as unknown as Comparable)['<='].apply(current as unknown as Comparable, [this.to]) as KopiBoolean).value;
      current = (current as unknown as Enumerable).succ(this.stride)
    ) {
      yield current;
    }
  }

  from: KopiValue;
  to: KopiValue;
  stride: KopiNumber;
}

addTraits([KopiIterable, KopiMonoid, Applicative], KopiRange);

export default KopiRange;
