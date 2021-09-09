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

  isSupertypeOf(valueType, visited = new Set(), depth = 0) {
    if (depth > 2 && visited.has(this)) {
      return false;
    }

    return this.isSubtypeOf(valueType, visited.add(this), depth + 1);
  }

  isSubtypeOf(valueType, visited = new Set(), depth = 0) {
    if (depth > 2 && visited.has(this)) {
      return false;
    }

    return valueType instanceof this.constructor || valueType.isSupertypeOf(this, visited.add(this), depth + 1);
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
