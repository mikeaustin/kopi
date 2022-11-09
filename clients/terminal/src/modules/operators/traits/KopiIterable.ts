import { Environment, Evaluate, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream } from '../../terminals/classes';

abstract class KopiIterable {
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async reduce(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiValue> {
    let result: Promise<KopiValue> = Promise.resolve(new KopiTuple([]));

    for await (const value of this) {
      result = func.apply(new KopiTuple([]), [new KopiTuple([result, Promise.resolve(value)]), evaluate, environment]);
    }

    return result;
  }

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        yield func.apply(new KopiTuple([]), [value, evaluate, environment]);
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async flatMap(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        yield* (await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiStream);
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async filter(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
          yield value;
        }
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async find(func: KopiFunction, evaluate: Evaluate, environment: Environment): Promise<KopiValue> {
    for await (const value of this) {
      if ((await func.apply(new KopiTuple([]), [value, evaluate, environment]) as KopiBoolean).value) {
        return value;
      }
    }

    return new KopiTuple([]);
  }

  take(count: KopiNumber) {
    let index = 0;

    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        if (index++ < count.value) {
          yield value;
        } else {
          break;
        }
      }
    }).apply(this);

    return new KopiStream(generator);
  }
}

export default KopiIterable;
