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
}

module.exports = {
  BooleanType,
};
