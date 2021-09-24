const util = require("util");

const { default: KopiString } = require('./classes/KopiString');
const { default: KopiTuple } = require('./classes/KopiTuple');
const { default: KopiRange } = require('./classes/KopiRange');
const { default: KopiFunction } = require('./classes/KopiFunction');
const { default: KopiVector } = require('./classes/KopiVector');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});


Boolean.prototype.toStringAsync = function () {
  return this.toString();
};

Boolean.prototype['=='] = function (that) {
  if (typeof that !== 'boolean') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

//

Number.prototype.toStringAsync = function () {
  return this.toString();
};

Number.prototype.succ = function () {
  return this + 1;
};

Number.prototype['+'] = function (that) {
  return this + that;
};

Number.prototype['*'] = function (that) {
  return this * that;
};

Number.prototype['=='] = function (that) {
  if (typeof that !== 'number') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

//

String.prototype.toStringAsync = function () {
  return this.toString();
};

String.prototype[util.inspect.custom] = function () {
  return `"${this}"`;
};

String.prototype.succ = function () {
  return String.fromCodePoint(this.codePointAt(0) + 1);
};

String.prototype.xsplit = function (delimiter) {
  return this.split(delimiter);
};

String.prototype['++'] = function (that) {
  if (typeof that !== 'string') {
    throw new Error(`Can't concat string with ${that.constructor.name}`);
  }

  return this.concat(that);
};

String.prototype['=='] = function (that) {
  if (typeof that !== 'string') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

//

Array.prototype.toStringAsync = async function () {
  const elements = await Promise.all(
    this.map(async element => (await element).toStringAsync())
  );

  return `[${elements.join(', ')}]`;
};

Array.prototype[util.inspect.custom] = function () {
  return `[${this.map(element => inspect(element)).join(', ')}]`;
};

Array.prototype.toArray = function () {
  return this;
};

Array.prototype['++'] = function (that) {
  return this.concat(that.toArray());
};

Array.prototype.xjoin = async function (args) {
  const elements = await Promise.all(this);

  return elements.join(args);
};

Array.prototype.xmap = async function (args, scope, visitors) {
  const values = [];

  for (const element of this) {
    values.push(await args.apply(undefined, [element, scope, visitors]));
  }

  return values;
};

Array.prototype.xreverse = async function (args, scope, visitors) {
  return [...this].reverse();
};

//

class TuplePattern {
  constructor(elements) {
    this.elements = elements;
  }

  getMatches(value) {
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
  constructor(name, init) {
    this.name = name;
    this.init = init;
  }

  getMatches(value, scope, visitors) {
    // console.log(this.predicate);
    // const x = visitors.visitNode(this.predicate, {
    //   ...scope,
    //   [this.name]: value
    // });
    // console.log(x);

    return {
      [this.name]: value === KopiTuple.empty && this.init ? this.init : value,
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
