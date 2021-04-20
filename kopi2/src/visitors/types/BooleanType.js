const { AnyType } = require('./AnyType');

class BooleanType extends AnyType {
  get name() {
    return `Boolean`;
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
}

module.exports = {
  BooleanType,
};
