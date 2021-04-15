const { AnyType } = require('./AnyType');

class StringType extends AnyType {
  get name() {
    return `String`;
  }

  escape() {
    return this.name;
  }

  includesType(valueType) {
    return valueType instanceof StringType;
  }

  //

  typeForField(field) {
    if (String.prototype[field.name] === undefined) {
      return null;
    }

    switch (field.name) {
      case 'length': return new NumberType();
    }
  }
}

module.exports = {
  StringType,
};
