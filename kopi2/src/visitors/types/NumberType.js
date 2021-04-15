const { AnyType } = require('./AnyType');

class NumberType extends AnyType {
  get name() {
    return `Number`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof NumberType;
  }

  typeForField(field) {
    if (typeof field.value === 'number' && field.value === 0) {
      return NumberType;
    }
  }
}

module.exports = {
  NumberType,
};
