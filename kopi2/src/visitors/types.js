class NoneType {
  get name() {
    return `None`;
  }

  escape() {
    return this.name;
  }

  includesType(type) {
    return false;
  }
}

class AnyType {
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

class BooleanType {
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

class NumberType {
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

class StringType {
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

class TupleType {
  constructor(...types) {
    this.types = types;
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

class FunctionType {
  constructor(params, rettype) {
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

class ArrayType {
  constructor(elementType) {
    this.elementType = elementType;
  }

  get name() {
    return `[${this.elementType?.name ?? ''}]`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    // console.log('ArrayType.includesType()', valueType.elementType, this.elementType);

    return valueType instanceof ArrayType && (valueType.elementType === undefined || valueType.elementType === this.elementType);
  }
}

module.exports = {
  NoneType: new NoneType(),
  AnyType: new AnyType(),
  Void: new TupleType(),
  BooleanType: new BooleanType(),
  NumberType: new NumberType(),
  StringType: new StringType(),
  TupleType: (...types) => new TupleType(...types),
  FunctionType: (params, type) => new FunctionType(params, type),
  UnionType: (...types) => new UnionType(...types),
  ArrayType: (type) => new ArrayType(type),
};
