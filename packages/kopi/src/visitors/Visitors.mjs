class Visitors {
  visitNode(astNode, scope, bind) {
    if (!astNode) {
      return;
    }

    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No ${this.constructor.name} AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

export default Visitors;
