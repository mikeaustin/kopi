const { AnyType } = require('./AnyType');
const { NumberType } = require('./NumberType');

class StringType extends AnyType {
  get name() {
    return `String`;
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

    return this.isSubtypeOf(valueType);
  }

  isSubtypeOf(valueType, depth = 0) {
    if (depth > 2) {
      return false;
    }

    return valueType instanceof this.constructor || valueType.isSupertypeOf(this, depth + 1);
  }

  //

  typeForField(field) {
    if (String.prototype[field.name] === undefined) {
      return null;
    }

    switch (field.name) {
      case 'length': return new NumberType();
    }
  }
}

module.exports = {
  StringType,
};
