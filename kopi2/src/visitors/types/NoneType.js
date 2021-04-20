const { AnyType } = require('./AnyType');

class NoneType extends AnyType {
  get name() {
    return `None`;
  }

  isSupertypeOf(valueType) {
    return false;
  }

  isSubtypeOf(valueType) {
    return true;
  }
}

module.exports = {
  NoneType,
};
