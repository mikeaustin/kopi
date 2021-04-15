const { AnyType } = require('./AnyType');

class NoneType extends AnyType {
  get name() {
    return `None`;
  }
}

module.exports = {
  NoneType,
};
