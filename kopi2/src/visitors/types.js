class Type {
}

class AnyType extends Type {
  get name() {
    return `Any`;
  }

  escape() {
    return this.name;
  }

  includesType(type) {
    return true;
  }
}

class NoneType extends AnyType {
  get name() {
    return `None`;
  }
}

class BooleanType extends Type {
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

class NumberType extends Type {
  get name() {
    return `Number`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof NumberType;
  }
}

class StringType extends Type {
  get name() {
    return `String`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof StringType;
  }

  typeForField(field) {
    if (String.prototype[field.name] === undefined) {
      return null;
    }

    switch (field.name) {
      case 'length': return new NumberType();
    }
  }
}

class TupleType extends Type {
  constructor(...types) {
    super();

    this.types = types;
  }

  includesType(valueType) {
    // if (valueType.types.length === 0 && this.types.length === 0) {
    //   return true;
    // }

    return valueType instanceof TupleType && valueType.types.every((t, index) => t.includesType(this.types[index]));
  }

  typeForField(field) {
    if (typeof field.value === 'number') {
      if (field.value > this.types.length - 1) {
        return null;
      }

      return this.types[field.value];
    }
  }

  get name() {
    if (this.types.length === 0) {
      return `Void`;
    }

    return `(${this.types.map(type => type.name).join(', ')})`;
  }

  escape() {
    return this.name;
  }
}

class FunctionType extends Type {
  constructor(params, rettype) {
    super();

    this.params = params;
    this.rettype = rettype;
  }

  get name() {
    return `${this.params.type?.name} => ${this.rettype?.name}`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof FunctionType;
  }
}

class UnionType {
  constructor(...types) {
    this.types = types;
  }

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

class RangeType extends Type {
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

class ArrayType extends Type {
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
  NoneType: new NoneType(),
  AnyType: new AnyType(),
  VoidType: new TupleType(),
  BooleanType: new BooleanType(),
  NumberType: new NumberType(),
  StringType: new StringType(),
  RangeType: (type) => new RangeType(type),
  TupleType: (...types) => new TupleType(...types),
  FunctionType: (params, rettype) => new FunctionType(params, rettype),
  UnionType: (...types) => new UnionType(...types),
  ArrayType: (type) => new ArrayType(type),
};
