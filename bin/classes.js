class Tuple {
  constructor(values, fields) {
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
    for (let i = this.from; i < this.to; ++i) {
      yield i;
    }
  }

  inspect() {
    return `${this.from.inspect()}..${this.to.inspect()}`;
  }
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
    // console.log('Function.kopiApply scope', scope);

    const matches = this.params.match(evaluatedArgs);

    const newScope = Object.setPrototypeOf(matches, this.closure);

    return this.statements.reduce(({ value, scope }, statement) => {
      const result = visitors.visit(statement, newScope);
      console.trace('Function.koniApply scope', result.scope);

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
