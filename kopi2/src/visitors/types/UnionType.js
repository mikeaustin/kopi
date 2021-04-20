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

  isSupertypeOf(valueType, depth = 0) {
    if (depth > 2) {
      return false;
    }

    return this.types.some(type => valueType.isSubtypeOf(type, depth + 1));
  }
}

module.exports = {
  UnionType,
};
