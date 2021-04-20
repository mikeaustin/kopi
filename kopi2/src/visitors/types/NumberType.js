const { AnyType } = require('./AnyType');

class NumberType extends AnyType {
  get name() {
    return `Number`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof this.constructor;
  }

  isSupertypeOf(valueType, depth = 0) {
    if (depth > 2) {
      return false;
    }

    return this.isSubtypeOf(valueType, depth + 1);
  }

  isSubtypeOf(valueType, depth = 0) {
    if (depth > 2) {
      return false;
    }

    return valueType instanceof this.constructor || valueType.isSupertypeOf(this, depth + 1);
  }

  //

  typeForField(field) {
    if (typeof field.value === 'number' && field.value === 0) {
      return new NumberType();
    }
  }
}

module.exports = {
  NumberType,
};
