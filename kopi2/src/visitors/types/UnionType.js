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
}

module.exports = {
  UnionType,
};
