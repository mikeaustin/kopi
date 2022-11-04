import { Environment, Evaluate, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";

import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream } from '../../terminals/classes';

import KopiIterable from '../traits/KopiIterable';

class KopiRange extends KopiValue {
  constructor(from: Promise<KopiValue>, to: Promise<KopiValue>) {
    super();

    this.from = from;
    this.to = to;
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  async *[Symbol.asyncIterator]() {
    const [from, _to] = [await this.from, await this.to];
    // const op = from > to ? '>=' : '<=';

    const fromTraits = (from.constructor as typeof KopiValue).traits;
    const toTraits = (_to.constructor as typeof KopiValue).traits;

    let errors: string[] = [];

    if (!fromTraits.includes(Enumerable)) errors.push(`  'from' value '${await from.inspect()}' is missing trait 'Enumerable'`);
    if (!fromTraits.includes(Comparable)) errors.push(`  'from' value '${await from.inspect()}' is missing trait 'Comparable'`);
    if (!toTraits.includes(Enumerable)) errors.push(`  'to' value '${await _to.inspect()}' is missing trait 'Enumerable'`);
    if (!toTraits.includes(Comparable)) errors.push(`  'to' value '${await _to.inspect()}' is missing trait 'Comparable'`);

    if (errors.length > 0) {
      throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
    }

    const to = (_to as unknown as Enumerable).succ();

    for (
      let current = from;
      ((current as unknown as Comparable).compare.apply(current, [to]) as KopiNumber).value < 0;
      // ((current as unknown as Comparable)['<'].apply(new KopiTuple([]), [to]) as KopiBoolean).value;
      current = (current as unknown as Enumerable).succ()
    ) {
      yield current;
    }
  }

  from: Promise<KopiValue>;
  to: Promise<KopiValue>;
}

(KopiRange.prototype as any).map = KopiIterable.prototype.map;
(KopiRange.prototype as any).filter = KopiIterable.prototype.filter;

export default KopiRange;
