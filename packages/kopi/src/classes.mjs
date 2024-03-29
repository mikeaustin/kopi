import './classes/Boolean.mjs';
import './classes/Number.mjs';
import './classes/Map.mjs';

import KopiString from './classes/KopiString.mjs';
import KopiTuple from './classes/KopiTuple.mjs';
import KopiArray from './classes/KopiArray.mjs';
import KopiRange from './classes/KopiRange.mjs';
import KopiFunction from './classes/KopiFunction.mjs';
import KopiVector from './classes/KopiVector.mjs';
import KopiDict from './classes/KopiDict.mjs';
import KopiEnum from './classes/KopiEnum.mjs';

class TuplePattern {
  constructor(elementsArray, fieldsArray) {
    this._patternElementsArray = elementsArray;
    this._patternFieldNamesArray = fieldsArray;
  }

  async getMatches(tuple) {
    if (!(tuple instanceof KopiTuple)) {
      return null;
    }

    const matchesArray = await this._patternElementsArray.reduce(async (matchesArray, element, index) => ([
      ...await matchesArray,
      this._patternFieldNamesArray[index] !== null
        ? await element.getMatches(await tuple.getFieldWithName(this._patternFieldNamesArray[index]) ?? KopiTuple.empty)
        : await element.getMatches(await tuple.getFieldAtIndex(index) ?? KopiTuple.empty),
    ]), []);

    if (matchesArray.some((match) => match === null)) {
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
    if (this._elementsArray.length !== array._elementsArray.length) {
      return null;
    }

    const matchesArray = await this._elementsArray.reduce(async (matchesArray, element, index) => ([
      ...await matchesArray,
      await element.getMatches(await array._elementsArray[index]),
    ]), []);

    if (matchesArray.some((matches) => matches === null)) {
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
      [this._functionName]: new KopiFunction(this._functionParams, unevaluatedValue, scope),
    };
  }
}

export {
  KopiString,
  KopiTuple,
  KopiArray,
  KopiRange,
  KopiFunction,
  KopiVector,
  KopiDict,
  KopiEnum,
  TuplePattern,
  ArrayLiteralPattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern,
};
