const { AnyType } = require('./AnyType');

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
}

module.exports = {
  RangeType,
};
