//
// InterpreterVisitors.js
//

const visit = (visitors, node) => {
  if (visitors[node.constructor.name]) {
    return visitors[node.constructor.name](node);
  } else {
    throw new Error('No visitor for ' + node.constructor.name);
  }
};

class InterpreterVisitors {
  constructor(scope) {
    this.scope = scope;
  }

  ApplyExpression({ expr: { params, statements }, args }) {
    const evaluatedArgs = visit(this, args);

    this.scope = Object.create(this.scope, params.elements.reduce((scope, param, index) => ({
      ...scope,
      [param.name]: {
        value: evaluatedArgs[index]
      }
    }), {}));

    return statements.reduce((_, statement) => visit(this, statement), undefined);
  }

  OperatorExpression({ op, left, right }) {
    switch (op) {
      case '+': return visit(this, left) + visit(this, right);
      case '-': return visit(this, left) - visit(this, right);
    }
  }

  TupleExpression({ elements }) {
    return elements.map(value => visit(this, value));
  }

  FunctionExpression({ params, statements }) {
    return {
      params: visit(this, params),
      statements: statements
    };
  }

  TuplePattern({ elements }) {
    return elements.map(value => visit(this, value));
  }

  Literal({ value }) {
    return value;
  }

  Identifier({ name }) {
    if (!(name in this.scope)) {
      throw new Error(`Variable '${name}' is not defined`);
    }

    return this.scope[name];
  }
}

module.exports = {
  default: InterpreterVisitors
};
