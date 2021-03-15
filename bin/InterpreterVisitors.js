//
// InterpreterVisitors.js
//

const visit = (visitors, node, scope) => {
  if (visitors[node.constructor.name]) {
    return visitors[node.constructor.name](node, scope);
  } else {
    throw new Error('No visitor for ' + node.constructor.name);
  }
};

class InterpreterVisitors {
  ApplyExpression({ expr: { params, statements }, args }, scope) {
    const evaluatedArgs = visit(this, args, scope);
    const functionScope = Object.create(scope, params.elements.reduce((scope, param, index) => ({
      ...scope,
      [param.name]: {
        value: evaluatedArgs[index]
      }
    }), {}));

    return statements.reduce((_, statement) => visit(this, statement, functionScope), undefined);
  }

  OperatorExpression({ op, left, right }, scope) {
    switch (op) {
      case '+': return visit(this, left, scope) + visit(this, right, scope);
      case '-': return visit(this, left, scope) - visit(this, right, scope);
    }
  }

  TupleExpression({ elements }, scope) {
    return elements.map(value => visit(this, value, scope));
  }

  FunctionExpression({ params, statements }, scope) {
    return {
      params: visit(this, params, scope),
      statements: statements
    };
  }

  TuplePattern({ elements }, scope) {
    return elements.map(value => visit(this, value, scope));
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
  default: InterpreterVisitors,
  visit
};
