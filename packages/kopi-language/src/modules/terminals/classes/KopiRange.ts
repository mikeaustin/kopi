import { addTraits, KopiValue, KopiCollection, Context } from '../../shared.js';
import { KopiApplicative, KopiEnumerable } from '../../shared.js';

import { KopiArray, KopiBoolean, KopiNumber } from './index.js';

import KopiIterable from '../traits/KopiIterable.js';
import Comparable from '../traits/KopiComparable.js';

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

  from: KopiValue;
  to: KopiValue;
  stride: KopiNumber;

  constructor(from: KopiValue, to: KopiValue, stride?: KopiNumber) {
    super();

    this.from = from;
    this.to = to;
    this.stride = stride ?? new KopiNumber(1);
  }

  override async toString() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  async '=='(that: KopiRange, context: Context) {
    if (!(await that.from.invoke('==', [this.from, context]) as KopiBoolean).value) {
      return new KopiBoolean(false);
    };

    if (!(await that.to.invoke('==', [this.to, context]) as KopiBoolean).value) {
      return new KopiBoolean(false);
    };

    if (!(await that.stride.invoke('==', [this.stride, context]) as KopiBoolean).value) {
      return new KopiBoolean(false);
    };

    return new KopiBoolean(true);
  }

  // Applicatie methods

  async apply(thisArg: KopiValue, [by]: [KopiNumber]) {
    return new KopiRange(this.from, this.to, by);
  }

  // Iterator methods

  *iterator() {
    let errors: string[] = [];

    assertTrait(this.from, 'from', [KopiEnumerable, Comparable], errors);
    assertTrait(this.to, 'to', [KopiEnumerable, Comparable], errors);

    if (errors.length > 0) {
      throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
    }

    for (
      let current = this.from;
      ((current as unknown as Comparable)['<='].apply(current as unknown as Comparable, [this.to]) as KopiBoolean).value;
      current = (current as unknown as KopiEnumerable).succ(this.stride)
    ) {
      yield current;
    }
  }

  async *[Symbol.asyncIterator]() {
    let errors: string[] = [];

    assertTrait(this.from, 'from', [KopiEnumerable, Comparable], errors);
    assertTrait(this.to, 'to', [KopiEnumerable, Comparable], errors);

    if (errors.length > 0) {
      throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
    }

    for (
      let current = this.from;
      ((current as unknown as Comparable)['<='].apply(current as unknown as Comparable, [this.to]) as KopiBoolean).value;
      current = (current as unknown as KopiEnumerable).succ(this.stride)
    ) {
      yield current;
    }
  }
}

addTraits([KopiIterable, KopiCollection, KopiApplicative], KopiRange);

export default KopiRange;
