class AnyType {
  get name() {
    return 'Any';
  }

  isSupertypeOf(type) {
    return true;
  }
}

class NoneType extends AnyType {
  get name() {
    return 'None';
  }

  isSupertypeOf(type) {
    return false;
  }
}

class UnionType extends AnyType {
  constructor(types) {
    super();

    this.types = types;
  }

  get name() {
    if (this.types.length === 0) {
      return 'None';
    }

    return `${this.types.map((type) => type.name).join(' | ')}`;
  }

  isSupertypeOf(type) {
    if (this.types.length === 0) {
      return false;
    }

    return this.types.some((_type) => type instanceof _type.constructor);
  }
}

class BooleanType extends AnyType {
  get name() {
    return 'Boolean';
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }
}

class NumberType extends AnyType {
  get name() {
    return 'Number';
  }

  isSupertypeOf(type) {
    return this instanceof (type._delegate ?? type).constructor;
  }
}

class StringType extends AnyType {
  get name() {
    return 'String';
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }

}

class FunctionType {
  constructor(params, rettype, expr, context) {
    this.params = params;
    this.rettype = rettype;
    this.expr = expr;
    this.context = context;
  }

  get name() {
    return 'Function';
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }
}

class IdentifierPatternType {
  constructor(name, type = new AnyType()) {
    this.name = name;
    this.type = type;
  }

  getTypeMatches(type) {
    if (!this.type.isSupertypeOf(type)) {
      return null;
    }

    return {
      [this.name]: type,
    };
  }
}

export {
  AnyType,
  NoneType,
  UnionType,
  BooleanType,
  NumberType,
  StringType,
  FunctionType,
  IdentifierPatternType,
};
