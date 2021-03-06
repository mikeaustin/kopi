class BaseVisitors {
  constructor(error) {
    this.error = error;
  }

  visitNode(node, scope, bind) {
    if (node === null) {
      return undefined;
    }

    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope, bind);
    } else {
      throw new Error(`No AST node visitor for ${this.constructor.name} '${node.constructor.name}'`);
    }
  }
}

module.exports = {
  default: BaseVisitors
};
