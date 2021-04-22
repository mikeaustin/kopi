const { AnyType } = require('./AnyType');
const { FunctionType } = require('./FunctionType');

class TupleType extends AnyType {
  constructor(...types) {
    super();

    this.types = types;
  }

  //

  get name() {
    if (this.types.length === 0) {
      return `Unit`;
    }

    return `(${this.types.map(type => type.name).join(', ')})`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    if (valueType instanceof TupleType && valueType.types.length === 0 && this.types.length === 0) {
      return true;
    }

    return valueType instanceof TupleType && valueType.types.every((t, index) => t.includesType(this.types[index]));
  }

  //

  typeForField(field) {
    if (typeof field.value === 'number') {
      if (field.value > this.types.length - 1) {
        return null;
      }

      return this.types[field.value];
    }

    return this.types[0];
    // return this.types[this.fieldTypes.indexOf(field.value)];
  }
}

module.exports = {
  TupleType,
};
