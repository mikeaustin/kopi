const { NumberType } = require("../types");

class TuplePattern {
  constructor(elements) {
    this.elements = elements;
  }

  escape() {
    return this.name;
  }

  matchValue(value) {
    return this.elements.reduce((scope, element, index) => {
      const matches = element.matchValue(value.elements[index]);

      return {
        ...scope,
        ...matches
      };
    }, {});
  }

  matchType(type) {
    // console.log('TuplePattern.matchType', type);

    return this.elements.reduce((context, element, index) => {
      return {
        ...context,
        [element.name]: type.types[index]
      };
    }, {});
  }
}

module.exports = {
  default: TuplePattern,
};
