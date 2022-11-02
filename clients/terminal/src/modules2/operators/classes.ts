import { Environment, Evaluate, KopiValue } from "../shared";
import { Applicative, Ordered } from "../shared";
import { KopiFunction, KopiNumber, KopiTuple } from '../terminals/classes';

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
    const [from, to] = [await this.from, await this.to];
    // const op = from > to ? '>=' : '<=';

    if (!(from.constructor as typeof KopiValue).traits.includes(Ordered)) {
      throw new Error(`Range requires from and to values to have trait 'Ordered'`);
    }

    for (
      let current = from;
      (current as KopiNumber).value <= (to as KopiNumber).value;
      current = (current as unknown as Ordered).succ()
    ) {
      yield current;
    }
  }

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment) {
    let accum: KopiValue[] = [];

    for await (const value of this) {
      accum.push(
        await func.apply(new KopiTuple([]), [value, evaluate, environment])
      );
    }

    console.log(accum);
    // return accum;
    return new KopiNumber(5);
  }

  from: Promise<KopiValue>;
  to: Promise<KopiValue>;
}

export {
  KopiRange,
};
