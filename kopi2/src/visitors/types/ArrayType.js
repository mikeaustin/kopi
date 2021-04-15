const { AnyType } = require('./AnyType');
const { TupleType } = require('./TupleType');
const { UnionType } = require('./UnionType');

class ArrayType extends AnyType {
  constructor(elementType) {
    super();

    this.elementType = elementType;
  }

  get name() {
    return `Array[${this.elementType?.name ?? ''}]`;
  }

  escape() {
    return this.name;
  }

  typeForField(field) {
    if (typeof field.value === 'number') {
      return new UnionType(this.elementType, new TupleType());
    }

    if (field.name === 'length') {
      return NumberType;
    }
  }

  includesType(valueType) {
    // console.log('ArrayType.includesType()', valueType.elementType, this.elementType);

    // return valueType instanceof ArrayType && (valueType.elementType === undefined || valueType.elementType === this.elementType);

    // return valueType instanceof ArrayType
    //   && (valueType.elementType === undefined || valueType.elementType.includesType(this.elementType));

    return valueType.elementType.includesType(this.elementType);
  }
}

module.exports = {
  ArrayType,
};
