class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

class OperatorExpression extends Node { }
class ApplyExpression extends Node { }

class NumericLiteral extends Node { }
class Identifier extends Node { }
