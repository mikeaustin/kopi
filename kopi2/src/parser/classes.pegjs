{
  class Node {
    constructor(properties) {
      Object.assign(this, properties);
    }
  }

  class Assignment extends Node { }

  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }

  class IdentifierPattern extends Node { }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class Identifier extends Node { }
}
