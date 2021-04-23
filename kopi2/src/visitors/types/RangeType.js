const { AnyType } = require('./AnyType');
const { NumberType } = require('./NumberType');
const { TupleType } = require('./TupleType');
const { UnionType } = require('./UnionType');

class RangeType extends AnyType {
  constructor(elementType) {
    super();

    this.elementType = elementType;
    this.params = {
      matchType() { return true; }
    };
  }

  get name() {
    return `Range[${this.elementType?.name}]`;
  }

  escape() {
    return this.name;
  }

  includesType(type) {
    return type instanceof this.constructor && this.elementType.includesType(type.elementType);
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
