const { AnyType } = require('./AnyType');
const { NumberType } = require('./NumberType');
const { TupleType } = require('./TupleType');
const { UnionType } = require('./UnionType');

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

  typeForField(field) {
    if (typeof field.value === 'number') {
      return new UnionType(this.elementType, new TupleType());
    }
  }

  typeForMethod(method) {
    return new NumberType();
  }
}

module.exports = {
  RangeType,
};
