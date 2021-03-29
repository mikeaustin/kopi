const util = require("util");

Object.prototype.inspect = function () {
  return util.inspect(this, {
    compact: false,
    depth: Infinity
  });
};

Boolean.prototype.inspect = function () {
  return `${this}`;
};

Number.prototype.inspect = function () {
  return `${this}`;
};

String.prototype.inspect = function () {
  return `"${this}"`;
};

Number.prototype['+'] = function (that) {
  return this + that;
};

Number.prototype['*'] = function (that) {
  return this * that;
};

String.prototype['++'] = function (that) {
  return this.concat(that);
};

Number.prototype.succ = function () {
  return this + 1;
};

String.prototype.succ = function () {
  return String.fromCharCode(this.codePointAt(0) + 1);
};

class Tuple {
  constructor(values, fields = []) {
    this.values = values;
    this.fields = fields;

    values.forEach((value, index) => this[index] = value);
  }

  inspect() {
    return `(${this.values.map((value, index) => (this.fields[index] ? `${this.fields[index].name}: ` : '') + value.inspect()).join(', ')})`;
  }

  toString() {
    return `(${this.values.map(value => value.inspect()).join(', ')})`;
  }

  zip = {
    kopiApply: (mapper, scope, visitors) => {
      const iters = this.values.map(value => value[Symbol.iterator]());
      const values = [];

      let results = iters.map(iter => iter.next());

      while (results.every(result => !result.done)) {
        values.push(
          mapper.kopiApply(new Tuple(results.map(result => result.value)), scope, visitors).value
        );

        results = iters.map(iter => iter.next());
      }

      return {
        value: values,
        scope
      };
    }
  };

  ['+'](that) {
    return new Tuple(this.values.reduce((values, value, index) => (
      values.push(typeof value === 'number'
        ? value + that.values[index]
        : value['+'](that.values[index])), values
    ), []));
  }

  ['++'](that) {
    return new Tuple(this.values.reduce((values, value, index) => (
      values.push(value.concat(that.values[index])), values
    ), []));
  }
}

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  *[Symbol.iterator]() {
    for (let value = this.from; value <= this.to; value = value.succ()) {
      yield value;
    }
  }

  inspect() {
    return `${this.from.inspect()}..${this.to.inspect()}`;
  }

  kopiApply = (mapper, scope, visitors) => {
    const values = [];

    for (let value = this.from; value <= this.to; ++value) {
      values.push(mapper.kopiApply(value, scope, visitors).value);
    }

    return { value: values, scope };
  };

  map = {
    kopiApply: (mapper, scope, visitors) => {
      const values = [];

      for (let value = this.from; value <= this.to; value = value.succ()) {
        values.push(mapper.kopiApply(value, scope, visitors).value);
      }

      return { value: values, scope };
    }
  };
}

Range.kopiApply = (args, scope) => {
  return {
    value: args,
    scope
  };
};

class Function {
  constructor(closure, params, statements) {
    this.closure = closure;
    this.params = params;
    this.statements = statements;
  }

  kopiApply(evaluatedArgs, scope, visitors) {
    const matches = this.params.match(evaluatedArgs);

    if (matches === null) {
      throw new Error(`Couldn’t match on value '${evaluatedArgs}'`);
    }

    const newScope = Object.setPrototypeOf(matches, this.closure);

    return this.statements.reduce(({ value, scope }, statement) => {
      const result = visitors.visit(statement, newScope);

      return {
        value: result.value,
        scope: { ...scope, ...result.scope }
      };
    }, { value: undefined, scope });
  }
}

module.exports = {
  Tuple,
  Range,
  Function
};
