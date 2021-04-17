const { AnyType } = require('./AnyType');
const { NumberType } = require('./NumberType');

class RangeType extends AnyType {
  constructor(elementType) {
    super();

    this.elementType = elementType;
  }

  get name() {
    return `Range[${this.elementType?.name}]`;
  }

  escape() {
    return this.name;
  }

  includesType(type) {
    return type.elementType === this.elementType;
  }

  //

  typeForMethod(method) {
    return new NumberType();
  }
}

module.exports = {
  RangeType,
};
