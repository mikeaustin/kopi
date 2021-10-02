class AnyType {
  get name() {
    return `Any`;
  }

  isSupertypeOf(type) {
    return true;
  }

  isSubtypeOf(type) {
    return false;
  }
}

class NoneType extends AnyType {
  get name() {
    return `None`;
  }

  isSupertypeOf(type) {
    return false;
  }

  isSubtypeOf(type) {
    return true;
  }
}

class BooleanType extends AnyType {
  get name() {
    return `Boolean`;
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }

  isSubtypeOf(type) {
    return type instanceof this.constructor;
  }
}

class NumberType extends AnyType {
  get name() {
    return `Number`;
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }

  isSubtypeOf(type) {
    return type instanceof this.constructor;
  }
}

class StringType extends AnyType {
  get name() {
    return `String`;
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }

  isSubtypeOf(type) {
    return type instanceof this.constructor;
  }
}

class FunctionType {
  constructor(params, rettype, body, context) {
    this.params = params;
    this.rettype = rettype;
    this.body = body;
    this.context = context;
  }

  isSupertypeOf(type) {
    return this instanceof type.constructor;
  }

  isSubtypeOf(type) {
    return type instanceof this.constructor;
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
      [this.name]: type
    };
  }
}

module.exports = {
  AnyType,
  NoneType,
  BooleanType,
  NumberType,
  StringType,
  FunctionType,
  IdentifierPatternType,
};
