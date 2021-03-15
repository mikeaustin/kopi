//
// InterpreterVisitors.js
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
  Assignment({ pattern, expr }, scope) {
    const newScope = pattern.name in scope ? Object.create(scope) : scope;

    return newScope[pattern.name] = this.visit(expr, newScope);
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope);
    const evaluatedExpr = this.visit(expr, scope);

    const { closure, params, statements } = evaluatedExpr;

    const functionScope = Object.create(closure, params.elements.reduce((scope, param, index) => ({
      ...scope,
      [param.name]: {
        value: evaluatedArgs[index]
      }
    }), {}));

    return statements.reduce((_, statement) => this.visit(statement, functionScope), undefined);
  }

  OperatorExpression({ op, left, right }, scope) {
    switch (op) {
      case '+': return this.visit(left, scope) + this.visit(right, scope);
      case '-': return this.visit(left, scope) - this.visit(right, scope);
    }
  }

  TupleExpression({ elements }, scope) {
    return elements.map(value => this.visit(value, scope));
  }

  FunctionExpression({ params, statements }, scope) {
    console.log('here', scope);
    return {
      closure: scope,
      params: params,
      statements: statements
    };
  }

  TuplePattern({ elements }, scope) {
    return elements.map(value => this.visit(value, scope));
  }

  Literal({ value }) {
    return value;
  }

  Identifier({ name }, scope) {
    if (!(name in scope)) {
      throw new Error(`Variable '${name}' is not defined`);
    }

    return scope[name];
  }
}

module.exports = {
  default: InterpreterVisitors
};
