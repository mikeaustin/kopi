const util = require("util");

require('./classes/Boolean');
require('./classes/Number');
require('./classes/String');
require('./classes/Array');
require('./classes/Map');

const { default: KopiString } = require('./classes/KopiString');
const { default: KopiTuple } = require('./classes/KopiTuple');
const { default: KopiRange } = require('./classes/KopiRange');
const { default: KopiFunction } = require('./classes/KopiFunction');
const { default: KopiVector } = require('./classes/KopiVector');

const { AnyType, NoneType } = require('./types');

class TuplePattern {
  constructor(elements, fields) {
    this.elements = elements;
    this.fields = fields;
  }

  getMatches(value) {
    // console.log('getMatches', this.fields);

    // TODO: Match one both non-fields and fields in the same tuple
    if (this.fields[0]) {
      const matchesArray = this.fields.map((field, index) => (
        this.elements[index].getMatches(value.elements[value.fields.indexOf(field)] ?? KopiTuple.empty)
      ));

      if (matchesArray.some(match => match === null)) {
        return null;
      }

      return matchesArray.reduce((scope, matches) => ({
        ...scope,
        ...matches,
      }), {});
    }

    const matchesArray = this.elements.map((element, index) => (
      element.getMatches(value.elements[index] ?? KopiTuple.empty)
    ));

    if (matchesArray.some(match => match === null)) {
      return null;
    }

    return matchesArray.reduce((scope, matches) => ({
      ...scope,
      ...matches,
    }), {});
  }
}

class BooleanLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  getMatches(value) {
    if (value !== this.value) {
      return null;
    }

    return {};
  }
}

class IdentifierPattern {
  constructor(name, init, type = new AnyType()) {
    this.name = name;
    this.init = init;
    this.type = type;
  }

  getMatches(value, scope, visitors) {
    // console.log(this.predicate);
    // const x = visitors.visitNode(this.predicate, {
    //   ...scope,
    //   [this.name]: value
    // });
    // console.log(x);

    return {
      [this.name]: value === KopiTuple.empty && this.init !== null ? this.init : value,
    };
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

class NumericLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  getMatches(value) {
    if (value !== this.value) {
      return null;
    }

    return {};
  }
}

class StringLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  getMatches(value) {
    if (value !== this.value) {
      return null;
    }

    return {};
  }
}

class ConstructorPattern {
  constructor(name, pattern) {
    this.name = name;
    this.pattern = pattern;
  }

  getMatches(value) {
    console.log('>>>', value);

    if (value.constructor.name !== this.name) {
      return null;
    }

    return {};

    //   if (value !== this.value) {
    //     return null;
    //   }

    //   return {};
  }
}

class FunctionPattern {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }

  getMatches(value, scope, unevaluatedValue) {
    return {
      [this.name]: new KopiFunction(this.params, unevaluatedValue, scope)
    };
  }
}

module.exports = {
  KopiString,
  KopiTuple,
  KopiRange,
  KopiFunction,
  KopiVector,
  TuplePattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern,
};
