import { Context, KopiValue } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream, KopiDict } from '../../terminals/classes';

abstract class KopiIterable {
  abstract [Symbol.iterator](): Iterator<Promise<KopiValue>>;
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    for await (const element of this) {
      values.push(Promise.resolve(element));
    }

    return new KopiArray(values);
  }

  async toDict() {
    const values: [key: KopiValue, value: Promise<KopiValue>][] = [];

    for await (const tuple of this as AsyncIterable<KopiTuple>) {
      const fields = [tuple.getFieldAt(0), tuple.getFieldAt(1)];

      if (fields[0] && fields[1]) {
        values.push([await fields[0], fields[1]]);
      }
    }

    return new KopiDict(values);
  }

  //

  async reduce(func: KopiFunction, context: Context): Promise<KopiValue> {
    let result: Promise<KopiValue> = Promise.resolve(new KopiTuple([]));

    for await (const value of this) {
      result = func.apply(new KopiTuple([]), [new KopiTuple([result, Promise.resolve(value)]), context]);
    }

    return result;
  }

  async map(func: KopiFunction, context: Context): Promise<KopiStream> {
    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        yield func.apply(new KopiTuple([]), [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  async flatMap(func: KopiFunction, context: Context): Promise<KopiStream> {
    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        yield* (await func.apply(new KopiTuple([]), [value, context]) as KopiStream);
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  async filter(func: KopiFunction, context: Context): Promise<KopiStream> {
    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        if ((await func.apply(new KopiTuple([]), [value, context]) as KopiBoolean).value) {
          yield value;
        }
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  //

  async find(func: KopiFunction, context: Context): Promise<KopiValue> {
    for await (const value of this) {
      if ((await func.apply(new KopiTuple([]), [value, context]) as KopiBoolean).value) {
        return value;
      }
    }

    return new KopiTuple([]);
  }

  take(count: KopiNumber) {
    let index = 0;

    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        if (index++ < count.value) {
          yield value;
        } else {
          break;
        }
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  skip(count: KopiNumber) {
    let index = 0;

    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        if (!(index++ < count.value)) {
          yield value;
        }
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  async some(func: KopiFunction, context: Context): Promise<KopiBoolean> {
    for await (const value of this) {
      if ((await func.apply(new KopiTuple([]), [value, context]) as KopiBoolean).value) {
        return new KopiBoolean(true);
      }
    }

    return new KopiBoolean(false);
  }

  async every(func: KopiFunction, context: Context): Promise<KopiBoolean> {
    for await (const value of this) {
      if (!(await func.apply(new KopiTuple([]), [value, context]) as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }

  async cycle() {
    const values = await this.toArray();

    const generator = async function* (this: KopiIterable) {
      while (true) {
        for await (const value of values) {
          yield value;
        }
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  async splitEvery(count: KopiNumber) {
    let values: KopiValue = (this.constructor as any).emptyValue();
    let index = 0;
    let length = 0;

    const generator = async function* (this: KopiIterable) {
      for (const value of this) {
        if (length > 0 && index % count.value === 0) {
          yield values;

          values = (this.constructor as any).emptyValue();
          length = 0;
        }

        values = (values as any).append(value);
        ++index;
        ++length;
      }

      if (length !== 0) {
        yield values;
      }
    }.apply(this);

    return new KopiStream(generator);
  }

}

export default KopiIterable;
