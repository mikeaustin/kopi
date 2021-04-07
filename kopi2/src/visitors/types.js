class AnyType {
  get name() {
    return `Any`;
  }

  includesType(type) {
    return true;
  }
}

class BooleanType {
  get name() {
    return `Boolean`;
  }

  includesType(valueType) {
    return valueType instanceof BooleanType;
  }
}

class NumberType {
  get name() {
    return `Number`;
  }

  includesType(valueType) {
    return valueType instanceof NumberType;
  }
}

class StringType {
  get name() {
    return `String`;
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
}

class FunctionType {
  constructor(params, rettype, body, scope) {
    this.params = params;
    this.rettype = rettype;
  }

  get name() {
    return `${this.params.type?.name} => ${this.rettype?.name}`;
  }

  // includesType(valueType) {
  //   return valueType;
  // }
}

class UnionType {
  constructor(...types) {
    this.types = types;
  }

  get name() {
    return `${this.types.map(type => type.name).join(' | ')}`;
  }

  includesType(valueType) {
    return this.types.some(type => type.includesType(valueType));
  }
}

module.exports = {
  AnyType: new AnyType(),
  Void: new TupleType(),
  BooleanType: new BooleanType(),
  NumberType: new NumberType(),
  StringType: new StringType(),
  TupleType: (...types) => new TupleType(...types),
  FunctionType: (params, rettype) => new FunctionType(params, rettype),
  UnionType: (...types) => new UnionType(...types),
};
