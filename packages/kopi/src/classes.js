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
const { default: KopiDict } = require('./classes/KopiDict');

class TuplePattern {
  constructor(elementsArray, fieldsArray) {
    this.elementsArray = elementsArray;
    this.fieldsArray = fieldsArray;
  }

  getMatches(value) {
    // console.log('getMatches', this.fields);

    // TODO: Match one both non-fields and fields in the same tuple
    if (this.fieldsArray?.[0]) {
      const matchesArray = this.fields.map((field, index) => (
        this.elementsArray[index].getMatches(
          value.elementsArray[value.fieldsArray.indexOf(field)] ?? KopiTuple.empty
        )
      ));

      if (matchesArray.some(match => match === null)) {
        return null;
      }

      return matchesArray.reduce((scope, matches) => ({
        ...scope,
        ...matches,
      }), {});
    }

    const matchesArray = this.elementsArray.map((element, index) => (
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

class ArrayLiteralPattern {
  constructor(elementsArray) {
    this.elementsArray = elementsArray;
  }

  getMatches(array) {
    if (this.elementsArray.length !== array.length) {
      return null;
    }

    const matchesArray = this.elementsArray.map((element, index) => (
      element.getMatches(array[index])
    ));

    if (matchesArray.some(matches => matches === null)) {
      return null;
    }

    return matchesArray.reduce((scope, matches) => ({
      ...scope,
      ...matches,
    }), {});
  }
}

class BooleanLiteralPattern {
  constructor(nativeBoolean) {
    this.nativeBoolean = nativeBoolean;
  }

  getMatches(boolean) {
    if (boolean !== this.nativeBoolean) {
      return null;
    }

    return {};
  }
}

class IdentifierPattern {
  constructor(identifierName, defaultValue) {
    this.identifierName = identifierName;
    this.defaultValue = defaultValue;
  }

  getMatches(value, scope, visitors) {
    // console.log(this.predicate);
    // const x = visitors.visitNode(this.predicate, {
    //   ...scope,
    //   [this.name]: value
    // });
    // console.log(x);

    const calculatedValue = value === KopiTuple.empty && this.defaultValue !== null
      ? this.defaultValue
      : value;

    return {
      [this.identifierName]: calculatedValue,
    };
  }
}

class NumericLiteralPattern {
  constructor(nativeNumber) {
    this.nativeNumber = nativeNumber;
  }

  getMatches(number) {
    if (number !== this.nativeNumber) {
      return null;
    }

    return {};
  }
}

class StringLiteralPattern {
  constructor(nativeString) {
    this.nativeString = nativeString;
  }

  getMatches(value) {
    if (value.nativeString !== this.nativeString) {
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
  constructor(functionName, functionParams) {
    this.functionName = functionName;
    this.functionParams = functionParams;
  }

  getMatches(value, scope, unevaluatedValue) {
    return {
      [this.functionName]: new KopiFunction(this.functionParams, unevaluatedValue, scope)
    };
  }
}

module.exports = {
  KopiString,
  KopiTuple,
  KopiRange,
  KopiFunction,
  KopiVector,
  KopiDict,
  TuplePattern,
  ArrayLiteralPattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern,
};
