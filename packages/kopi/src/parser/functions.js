class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

class OperatorExpression extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class ArrayExpression extends Node { }
class ApplyExpression extends Node { }

class TuplePattern extends Node { }
class IdentifierPattern extends Node { }

class NumericLiteral extends Node { }
class Identifier extends Node { }
