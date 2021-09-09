const { AnyType } = require('./AnyType');

class UnionType extends AnyType {
  constructor(...types) {
    super();

    this.types = types;
  }

  //

  get name() {
    return `${this.types.map(type => type.name).join(' | ')}`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return this.types.some(type => type.includesType(valueType));
  }

  isSupertypeOf(valueType, visited = new Set(), depth = 0) {
    if (depth > 2 && visited.has(this)) {
      return false;
    }

    // TODO: visited.add(this?) or type?
    return this.types.some(type => valueType.isSubtypeOf(type, visited.add(this), depth + 1));
  }
}

module.exports = {
  UnionType,
};
