import { Context, KopiValue, KopiMonoid, KopiTrait } from "../../shared";
import { KopiBoolean, KopiFunction, KopiNumber, KopiTuple, KopiArray, KopiStream, KopiDict } from '../../terminals/classes';
import { KopiStream2 } from "../../terminals/classes/KopiStream";

abstract class KopiIterable extends KopiTrait {
  // static emptyValue() { return new KopiValue(); };
  abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  async toArray() {
    const values: Promise<KopiValue>[] = [];

    const iter = this[Symbol.asyncIterator]();
    let result = iter.next();

    while (!(await result).done) {
      values.push((await result).value);

      result = iter.next();
    }

    return new KopiArray(values);
  }

  async toDict() {
    const values: [key: KopiValue, value: Promise<KopiValue>][] = [];

    for await (const tuple of this) {
      const fields = [tuple.getFieldAt(0), tuple.getFieldAt(1)];

      if (fields[0] && fields[1]) {
        values.push([await fields[0], fields[1]]);
      }
    }

    return new KopiDict(values);
  }

  //

  async reduce(func: KopiFunction, context: Context): Promise<KopiValue> {
    let accum: Promise<KopiValue> = Promise.resolve(new KopiTuple([]));

    const iter = this[Symbol.asyncIterator]();
    let result = iter.next();

    while (!(await result).done) {
      accum = func.apply(new KopiTuple([]), [new KopiTuple([accum, (await result).value]), context]);

      result = iter.next();
    }

    return accum;
  }

  async each(func: KopiFunction, context: Context): Promise<KopiValue> {
    for await (const value of this) {
      func.apply(new KopiTuple([]), [value, context]);
    }

    return new KopiTuple([]);
  }

  async map(func: KopiFunction, context: Context): Promise<KopiStream> {
    const generator = async function* (this: KopiIterable) {
      for await (const value of this) {
        yield func.apply(new KopiTuple([]), [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator);
  }

  // async map2(func: KopiFunction, context: Context): Promise<InstanceType<ReturnType<typeof KopiStream2>>> {
  //   const generator = async function* (this: KopiIterable) {
  //     for await (const value of this) {
  //       yield func.apply(new KopiTuple([]), [value, context]);
  //     }
  //   }.apply(this);

  //   return new (KopiStream2(KopiIterable.emptyValue() as unknown as KopiMonoid))(generator);
  // }

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

  async includes(value: KopiValue, context: Context): Promise<KopiBoolean> {
    for await (const _value of this) {
      if ((value['=='].apply(value, [await _value, context]) as KopiBoolean).value) {
        return new KopiBoolean(true);
      }
    }

    return new KopiBoolean(false);
  }

  async count(func: KopiFunction, context: Context): Promise<KopiNumber> {
    var count = 0;

    const iter = this[Symbol.asyncIterator]();
    let result = iter.next();

    while (!(await result).done) {
      count += 1;

      result = iter.next();
    }

    return new KopiNumber(count);
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
    const constructorTraits = (this.constructor as typeof KopiValue).traits;

    if (!constructorTraits.includes(KopiMonoid)) {
      throw new Error(`KopiIterable.splitEvery(): 'this' value '${await (this as unknown as KopiValue).inspect()}' of type '${(this as unknown as KopiValue).constructor.name}' does not conform to trait 'KopiMonoid'\n  Trait 'KopiMonoid' implements methods 'static emptyValue()' and 'append()'`);
    }

    let values: KopiValue = (this.constructor as typeof KopiMonoid).emptyValue();
    let index = 0;
    let length = 0;

    const generator = async function* (this: KopiIterable) {
      const iter = this[Symbol.asyncIterator]();
      let result = iter.next();

      while (!(await result).done) {
        if (length > 0 && index % count.value === 0) {
          yield values;

          values = (this.constructor as typeof KopiMonoid).emptyValue();
          length = 0;
        }

        values = await (values as unknown as KopiMonoid).append((await result).value);

        ++index;
        ++length;

        result = iter.next();
      }

      if (length !== 0) {
        yield values;
      }
    }.apply(this);

    return new KopiStream(generator);
  }

}

export default KopiIterable;
