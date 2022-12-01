import { addTraits, KopiValue, KopiCollection, Context, KopiApplicative } from '../../shared';

import KopiIterable from '../traits/KopiIterable';

import KopiNumber from './KopiNumber';
import KopiBoolean from "./KopiBoolean";
import KopiRange from './KopiRange';
import KopiTuple from './KopiTuple';
import KopiFunction from './KopiFunction';
import KopiString from './KopiString';

class KopiArray extends KopiValue {
  static readonly emptyValue = () => new KopiArray([]);

  readonly elements: Promise<KopiValue>[];

  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async toString() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }

  override async inspect() {
    return this.toString();
  }

  override async toJS() {
    return Promise.all(
      this.elements.map(async element => (await element).toJS())
    );
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  async apply(thisArg: KopiValue, [argument]: [KopiNumber]) {
    if (argument instanceof KopiArray) {
      const indices = argument;
      const accum: Promise<KopiValue>[] = [];

      for (const index of indices.elements) {
        const value = this.elements[(await index as KopiNumber).value] ?? Promise.resolve(KopiTuple.empty);

        accum.push(value);
      }

      return new KopiArray(accum);
    }

    if (argument instanceof KopiRange) {
      const range = argument;

      return new KopiArray(
        this.elements.slice((range.from as KopiNumber).value, (range.to as KopiNumber).value)
      );
    }

    if (argument instanceof KopiNumber) {
      const index = argument;

      return await this.elements[index.value] ?? KopiTuple.empty;
    }
  }

  has(index: KopiNumber) {
    return new KopiBoolean(index.value >= 0 && index.value < this.elements.length);
  }

  async get(index: KopiNumber): Promise<KopiValue> {
    return await this.elements[index.value] ?? KopiTuple.empty;
  }

  // TODO: Can't be done with this.elements.includes() since Array stores promises
  // includes(value: KopiValue) {
  //   return new KopiBoolean(false);
  // }

  // TODO: Don't resolve promises for arguments, since they may not need to be
  // Or, pass in values via a tuple or array to keep their promise
  set(index: KopiValue) {
    return (value: KopiValue) => {
      if (index instanceof KopiRange) {
        const elements = [...this.elements];

        const deleteCount = (index.to as KopiNumber).value - (index.from as KopiNumber).value + 1;
        elements.splice((index.from as KopiNumber).value, deleteCount, Promise.resolve(value));

        return new KopiArray(elements);
      } else if (index instanceof KopiNumber) {
        const elements = [...this.elements];

        elements[index.value] = Promise.resolve(value);

        return new KopiArray(elements);
      }
    };
  }

  remove(index: KopiNumber) {
    return new KopiArray(
      this.elements
        .slice(0, index.value)
        .concat(this.elements.slice(index.value + 1, Infinity))
    );
  }

  update(index: KopiNumber) {
    return async (func: KopiFunction, context: Context) => {
      const elements = [...this.elements];

      const value = elements[index.value] ?? Promise.resolve(KopiTuple.empty);
      elements[index.value] = func.apply(KopiTuple.empty, [await value, context]);

      return new KopiArray(elements);
    };
  }

  async '=='(that: KopiArray, context: Context): Promise<KopiBoolean> {
    if (that.elements.length !== this.elements.length) {
      return new KopiBoolean(false);
    }

    for (const [index, thatValue] of that.elements.entries()) {
      const thisValue = this.elements[index];

      if (thisValue === undefined) {
        return new KopiBoolean(false);
      }

      if (!(await (await thatValue).invoke('==', [await thisValue, context]) as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }

  *iterator() {
    for (const value of this.elements) {
      yield value;
    }
  }

  // TODO: This is not really async, but useful when you don't care about the value
  *[Symbol.asyncIterator]() {
    for (const value of this.elements) {
      yield value;
    }
  }

  append(that: KopiValue) {
    return new KopiArray(this.elements.concat([Promise.resolve(that)]));
  }

  async joinWith(separator: KopiString) {
    let string: KopiString = new KopiString('');

    for (const [index, value] of this.elements.entries()) {
      if (index > 0) {
        string = string.append(separator);
      }

      string = string.append(await value as KopiString);
    }

    return string;
  }
}

addTraits([KopiIterable, KopiCollection, KopiApplicative], KopiArray);

export default KopiArray;
