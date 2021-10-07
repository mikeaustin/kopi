class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

class Block extends Node { }
class Assignment extends Node { }

class PipeExpression extends Node { }
class OperatorExpression extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class ArrayExpression extends Node { }
class ApplyExpression extends Node { }
class RangeExpression extends Node { }
class MemberExpression extends Node { }

class TuplePattern extends Node { }
class NumericLiteralPattern extends Node { }
class IdentifierPattern extends Node { }

class NumericLiteral extends Node { }
class StringLiteral extends Node { }
class Identifier extends Node { }
