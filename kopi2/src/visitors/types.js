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
}

class TupleType {
  constructor(...types) {
    this.types = types;
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
};
