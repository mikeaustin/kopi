import { Environment, Evaluate, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiSequence } from '../../terminals/classes';

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

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        yield func.apply(new KopiTuple([]), [value, evaluate, environment]);
      }
    })();

    return new KopiSequence(generator);
  }

  from: Promise<KopiValue>;
  to: Promise<KopiValue>;
}

export default KopiRange;
