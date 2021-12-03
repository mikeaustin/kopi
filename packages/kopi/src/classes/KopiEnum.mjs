import KopiString from './KopiString.mjs';
import KopiTuple from './KopiTuple.mjs';
import KopiArray from './KopiArray.mjs';
import Iterable from '../traits/Iterable.mjs';

class EnumField {
  constructor(index, enumeration) {
    this._enumeration = enumeration;
    this.index = index;
    this.name = new KopiString(enumeration.getFieldNameAtIndex(this.index));
    this.value = enumeration.getFieldAtIndex(this.index);
  }

  inspectAsync() {
    return `EnumField (name: ${this.name.inspectAsync()}, value: ${this.value.inspectAsync()})`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  ['=='](that) {
    return this.value === that.value;
  }

  succ() {
    return this._enumeration[this.index + 1];
  }
}

class KopiEnum extends KopiTuple {
  constructor(fieldsArray, fieldNamesArray) {
    super(fieldsArray, fieldNamesArray);

    this._fieldsArray = this._fieldsArray.map((field, index) => new EnumField(index, this));

    this._fieldsArray.forEach((field, index) => {
      this[index] = field;
      this[this._fieldNamesArray[index]] = field;
    });
  }

  emptyValue() {
    return new KopiArray();
  }

  lowerBound() {
    return new (EnumField(0, this));
  }

  *[Symbol.iterator]() {
    for (const field of this._fieldsArray) {
      yield field;
    }
  }
}

KopiEnum.prototype.each = Iterable.prototype.each;
KopiEnum.prototype.map = Iterable.prototype.map;
KopiEnum.prototype.splitOn = Iterable.prototype.splitOn;

export default KopiEnum;
