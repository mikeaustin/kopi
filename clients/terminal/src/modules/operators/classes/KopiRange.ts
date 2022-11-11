import { KopiValue, Trait } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";

import { KopiNumber } from '../../terminals/classes';

import KopiIterable from '../traits/KopiIterable';

const assertTrait = async (value: KopiValue, variableName: string, trait: Function, errors: string[]) => {
  const traits = (value.constructor as typeof KopiValue).traits;

  if (!traits.includes(trait)) {
    errors.push(`'${variableName}' value '${await value.inspect()}' is missing trait '${trait.constructor.name}'`);
  }
};

class KopiRange extends KopiValue {
  static override traits = [Applicative];

  constructor(from: Promise<KopiValue>, to: Promise<KopiValue>, by?: Promise<KopiNumber>) {
    super();

    this.from = from;
    this.to = to;
    this.by = by ?? Promise.resolve(new KopiNumber(1));
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  async apply(thisArg: KopiValue, [by]: [KopiNumber]) {
    return new KopiRange(this.from, this.to, Promise.resolve(by));
  }

  async *[Symbol.asyncIterator]() {
    const [from, _to] = [await this.from, await this.to];
    // const op = from > to ? '>=' : '<=';

    let errors: string[] = [];

    assertTrait(from, 'from', Enumerable, errors);
    assertTrait(from, 'from', Comparable, errors);
    assertTrait(_to, 'to', Enumerable, errors);
    assertTrait(_to, 'to', Comparable, errors);

    if (errors.length > 0) {
      throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
    }

    const to = (_to as unknown as Enumerable).succ(await this.by);

    for (
      let current = from;
      ((current as unknown as Comparable).compare.apply(current, [to]) as KopiNumber).value < 0;
      // ((current as unknown as Comparable)['<'].apply(new KopiTuple([]), [to]) as KopiBoolean).value;
      current = (current as unknown as Enumerable).succ(await this.by)
    ) {
      yield current;
    }
  }

  from: Promise<KopiValue>;
  to: Promise<KopiValue>;
  by: Promise<KopiNumber>;
}

for (const name of Object.getOwnPropertyNames(KopiIterable.prototype)) {
  if (name !== 'constructor') {
    (KopiRange.prototype as any)[name] = (KopiIterable.prototype as any)[name];
  }
}

export default KopiRange;
