//
// InterpreterVisitors.js
//

class Tuple {
  constructor(values) {
    this.values = values;
  }

  toString() {
    `(${this.values.map(value => value.toString()).join(', ')})`;
  }
}

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
  Assignment({ pattern, expr }, scope) {
    const matches = pattern.match(this.visit(expr, scope).value, scope);

    const newScope = { ...scope, ...matches };

    return {
      value: undefined,
      scope: newScope
    };
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope).value;
    const evaluatedExpr = this.visit(expr, scope).value;

    const { closure, params, statements } = evaluatedExpr;

    const newScope = Object.create(closure, params.elements.reduce((scope, param, index) => ({
      ...scope,
      [param.name]: {
        value: evaluatedArgs[index].value
      }
    }), {}));

    return {
      value: statements.reduce((_, statement) => this.visit(statement, newScope).value, undefined),
      scope
    };
  }

  OperatorExpression({ op, left, right }, scope) {
    switch (op) {
      case '+': return { value: this.visit(left, scope).value + this.visit(right, scope).value, scope };
      case '-': return { value: this.visit(left, scope).value - this.visit(right, scope).value, scope };
    }
  }

  TupleExpression({ elements }, scope) {
    return {
      value: new Tuple(elements.map(value => this.visit(value, scope).value)),
      scope
    };
  }

  FunctionExpression({ params, statements }, scope) {
    return {
      value: {
        closure: scope,
        params: params,
        statements: statements
      },
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
