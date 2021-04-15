const { AnyType } = require('./AnyType');

class BooleanType extends AnyType {
  get name() {
    return `Boolean`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof BooleanType;
  }
}

module.exports = {
  BooleanType,
};
