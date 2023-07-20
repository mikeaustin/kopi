import { KopiValue } from '../../shared.js';

import KopiBoolean from './KopiBoolean.js';
import KopiString from './KopiString.js';
import KopiTuple from './KopiTuple.js';

class KopiEnumField extends KopiValue {
  _enum: KopiEnum;
  _index: number;
  name: KopiString;
  value: KopiValue;

  constructor(_enum: KopiEnum, index: number, name: KopiString, value: KopiValue) {
    super();

    this._enum = _enum;
    this._index = index;

    this.name = name;
    this.value = value;
  }

  override async inspect() {
    return `EnumField (name: ${await this.name.inspect()}, value: ${await this.value.inspect()})`;
  }

  ['=='](that: KopiEnumField) {
    return new KopiBoolean(this.value === that.value);
  }

  succ() {
    return this._enum._fields[this._index + 1];
  }
}

class KopiEnum extends KopiValue {
  readonly _fields: KopiValue[];
  readonly fieldNames: (string | null)[];

  constructor(fields: KopiValue[], fieldNames?: (string | null)[]) {
    super();

    this._fields = fields.map((field, index) => (
      new KopiEnumField(this, index, new KopiString(fieldNames?.[index] ?? ''), fields[index] ?? KopiTuple.empty)
    ));
    this.fieldNames = fieldNames ?? [];

    this._fields.forEach((field, index) => {
      (this as any)[index] = field;
      (this as any)[this.fieldNames[index] ?? ''] = field;
    });
  }

  override async inspect() {
    return `Enum`;
  }
}

export default KopiEnum;
