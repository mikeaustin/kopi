const { AnyType } = require('./AnyType');

class FunctionType extends AnyType {
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

module.exports = {
  FunctionType,
};
