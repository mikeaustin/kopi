const util = require("util");

require('./classes/Boolean');
require('./classes/Number');
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
    this._elementsArray = elementsArray;
    this._fieldsArray = fieldsArray;
  }

  async getMatches(tuple) {
    // console.log('getMatches');

    // TODO: Match one both non-fields and fields in the same tuple
    if (this._fieldsArray?.[0]) {
      const matchesArray = await this._fieldsArray.reduce(async (matchesArray, fieldName, index) => ([
        ...await matchesArray,
        await this._elementsArray[index].getMatches(
          tuple.getElementAtIndex(await tuple.getIndexOfFieldName(fieldName)) ?? KopiTuple.empty
        )
      ]));

      if (matchesArray.some(match => match === null)) {
        return null;
      }

      return matchesArray.reduce((scope, matches) => ({
        ...scope,
        ...matches,
      }), {});
    }

    const matchesArray = await this._elementsArray.reduce(async (matchesArray, element, index) => ([
      ...await matchesArray,
      await (await element).getMatches(await tuple.getElementAtIndex(index) ?? KopiTuple.empty),
    ]), []);

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
    this._elementsArray = elementsArray;
  }

  async getMatches(array) {
    if (this._elementsArray.length !== array.length) {
      return null;
    }

    const matchesArray = await this._elementsArray.reduce(async (matchesArray, element, index) => ([
      ...await matchesArray,
      await element.getMatches(array[index])
    ]), []);

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
    this._nativeBoolean = nativeBoolean;
  }

  getMatches(boolean) {
    if (boolean !== this._nativeBoolean) {
      return null;
    }

    return {};
  }
}

class IdentifierPattern {
  constructor(identifierName, defaultValue) {
    this._identifierName = identifierName;
    this._defaultValue = defaultValue;
  }

  getMatches(value, scope, visitors) {
    // console.log(this.predicate);
    // const x = visitors.visitNode(this.predicate, {
    //   ...scope,
    //   [this.name]: value
    // });
    // console.log(x);

    const calculatedValue = value === KopiTuple.empty && this._defaultValue !== null
      ? this._defaultValue
      : value;

    return {
      [this._identifierName]: calculatedValue,
    };
  }
}

class NumericLiteralPattern {
  constructor(nativeNumber) {
    this._nativeNumber = nativeNumber;
  }

  getMatches(number) {
    if (number !== this._nativeNumber) {
      return null;
    }

    return {};
  }
}

class StringLiteralPattern {
  constructor(nativeString) {
    this._nativeString = nativeString;
  }

  getMatches(value) {
    if (!(value instanceof KopiString) || value.getNativeString() !== this._nativeString) {
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
    this._functionName = functionName;
    this._functionParams = functionParams;
  }

  getMatches(value, scope, unevaluatedValue) {
    return {
      [this._functionName]: new KopiFunction(this._functionParams, unevaluatedValue, scope)
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
