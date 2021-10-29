class Visitors {
  visitNode(astNode, scope, bind) {
    if (!astNode) {
      return;
    }

    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

module.exports = {
  default: Visitors
};
