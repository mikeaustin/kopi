import { Environment, Evaluate, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiSequence } from '../../terminals/classes';

abstract class KopiIterable {
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiSequence> {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        yield func.apply(new KopiTuple([]), [value, evaluate, environment]);
      }
    })();

    return new KopiSequence(generator);
  }

  async filter(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiSequence> {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
          yield value;
        }
      }
    })();

    return new KopiSequence(generator);
  }
}

export default KopiIterable;
