import { Environment, Evaluate, BindValues, KopiValue } from "../../shared";
import { Applicative, Enumerable, Comparable } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream } from '../../terminals/classes';

abstract class KopiIterable {
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values);
  }

  async reduce(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiValue> {
    let result: Promise<KopiValue> = Promise.resolve(new KopiTuple([]));

    for await (const value of this) {
      result = func.apply(new KopiTuple([]), [new KopiTuple([result, Promise.resolve(value)]), evaluate, environment, bindValues]);
    }

    return result;
  }

  async map(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        yield func.apply(new KopiTuple([]), [value, evaluate, environment, bindValues]);
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async flatMap(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        yield* (await func.apply(new KopiTuple([]), [value, evaluate, environment, bindValues]) as KopiStream);
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async filter(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiStream> {
    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        if ((await func.apply(new KopiTuple([]), [value, evaluate, environment, bindValues]) as KopiBoolean).value) {
          yield value;
        }
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async find(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiValue> {
    for await (const value of this) {
      if ((await func.apply(new KopiTuple([]), [value, evaluate, environment, bindValues]) as KopiBoolean).value) {
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

  drop(count: KopiNumber) {
    let index = 0;

    const generator = (async function* (this: KopiIterable) {
      for await (const value of this) {
        if (!(index++ < count.value)) {
          yield value;
        }
      }
    }).apply(this);

    return new KopiStream(generator);
  }

  async some(func: KopiFunction, evaluate: Evaluate, environment: Environment, bindValues: BindValues): Promise<KopiBoolean> {
    for await (const value of this) {
      if ((await func.apply(new KopiTuple([]), [value, evaluate, environment, bindValues]) as KopiBoolean).value) {
        return new KopiBoolean(true);
      }
    }

    return new KopiBoolean(false);
  }
}

export default KopiIterable;
