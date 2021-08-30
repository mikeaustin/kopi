class Visitors {
  visit(node, scope) {
    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new Error(`No AST visitor for '${node.constructor.name}'`);
    }
  }
}

class InterpreterVisitors extends Visitors {
  NumericNode({ value }, scope) {
    return value;
  }
}

module.exports = {
  default: new InterpreterVisitors(),
};
