import { ASTNode, ASTPatternNode, Applicative, Environment, Evaluate, KopiValue } from "../shared";
import { Numeric, Equatable } from "../shared";
import { KopiFunction, KopiNumber } from '../terminals/classes';

class KopiRange extends KopiValue {
  constructor(from: Promise<KopiValue>, to: Promise<KopiValue>) {
    super();

    this.from = from;
    this.to = to;
  }

  // override async inspect() {
  //   return this.value ? 'true' : 'false';
  // }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  map(func: KopiFunction) {
    console.log('here', func);

    return new KopiNumber(5);
  }

  from: Promise<KopiValue>;
  to: Promise<KopiValue>;
}

export {
  KopiRange,
};
