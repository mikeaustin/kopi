import { Environment, Evaluate, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream } from '../../terminals/classes';

abstract class KopiIterable {
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiStream> {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        yield func.apply(new KopiTuple([]), [value, evaluate, environment]);
      }
    })();

    return new KopiStream(generator);
  }

  async filter(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiStream> {
    const _this = this;

    const generator = (async function* () {
      for await (const value of _this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
          yield value;
        }
      }
    })();

    return new KopiStream(generator);
  }
}

export default KopiIterable;
