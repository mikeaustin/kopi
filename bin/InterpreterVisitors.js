//
// InterpreterVisitors.js
//

class Tuple {
  constructor(values) {
    this.values = values;

    values.forEach((value, index) => this[index] = value);
  }

  inspect() {
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

  inspect() {
    return `${this.from.inspect()}..${this.to.inspect()}`;
  }
}

class Function {
  constructor(closure, params, statements) {
    this.closure = closure;
    this.params = params;
    this.statements = statements;
  }

  kopiApply(evaluatedArgs, scope, visitors) {
    // console.log('Function.kopiApply scope', scope);

    const matches = this.params.match(evaluatedArgs);

    const newScope = Object.setPrototypeOf({ ...scope, ...matches }, this.closure);

    return this.statements.reduce(({ value, scope }, statement) => {
      const result = visitors.visit(statement, newScope);

      return {
        value: result.value,
        scope: { ...scope, ...result.scope }
      };
    }, { value: undefined, scope });
  }
}

//

class Visitors {
  visit(node, scope) {
    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new Error('No visitor for ' + node.constructor.name);
    }
  }
}

class InterpreterVisitors extends Visitors {
  Ast({ expr }, scope) {
    return { value: expr, scope };
  }

  Assignment({ pattern, expr }, scope) {
    const matches = pattern.match(this.visit(expr, scope).value);

    return {
      value: undefined,
      scope: { ...scope, ...matches }
    };
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope).value;
    const evaluatedExpr = this.visit(expr, scope).value;

    // console.trace('Apply', evaluatedExpr, evaluatedArgs);

    if (evaluatedExpr instanceof Tuple && evaluatedExpr.values.length === 0) {
      return { value: evaluatedExpr, scope };
    }

    const result = evaluatedExpr.kopiApply(evaluatedArgs, scope, this);

    return { value: result.value, scope: { ...scope, ...result.scope } };
  }

  OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = this.visit(left, scope).value;
    const evaluatedRight = this.visit(right, scope).value;

    if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
      switch (op) {
        case '+': return { value: evaluatedLeft + evaluatedRight, scope };
        case '-': return { value: evaluatedLeft - evaluatedRight, scope };
      }
    }

    if (evaluatedLeft instanceof Tuple && evaluatedLeft.values.length === 0) {
      return { value: evaluatedRight, scope };
    }

    if (evaluatedRight instanceof Tuple && evaluatedRight.values.length === 0) {
      return { value: evaluatedLeft, scope };
    }

    return { value: evaluatedLeft[op](evaluatedRight), scope };
  }

  TupleExpression({ elements }, scope) {
    return {
      value: new Tuple(elements.map(value => this.visit(value, scope).value)),
      scope
    };
  }

  RangeExpression({ from, to }, scope) {
    return {
      value: new Range(this.visit(from, scope).value, this.visit(to, scope).value),
      scope
    };
  }

  FunctionExpression({ params, statements }, scope) {
    return {
      value: new Function(scope, params, statements),
      scope
    };
  }

  FieldExpression({ expr, field }, scope) {
    return {
      value: this.visit(expr, scope).value[field.name || field.value],
      scope
    };
  }

  TuplePattern({ elements }, scope) {
    return {
      value: elements.map(value => this.visit(value, scope).value),
      scope
    };
  }

  Literal({ value }) {
    return { value: value };
  }

  Identifier({ name }, scope) {
    if (!(name in scope)) {
      throw new Error(`Variable '${name}' is not defined`);
    }

    return { value: scope[name], scope };
  }
}

module.exports = {
  default: InterpreterVisitors
};
