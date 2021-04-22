// const util = require("util");

const { AnyType } = require('./AnyType');

class FunctionType extends AnyType {
  constructor(params, rettype, body, context) {
    super();

    this.params = params;
    this.rettype = rettype;
    this.body = body;
    this.context = context;

    // if (this.context) this.context[util.inspect.custom] = () => {
    //   return '{ ... }';
    // };
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
