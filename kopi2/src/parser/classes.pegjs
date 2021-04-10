{
  class Node {
    constructor(properties) {
      Object.assign(this, properties);
    }
  }

  class AstNode extends Node { }
  class AstIdentifierNode extends Node { }
  class Assignment extends Node { }

  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class FieldExpression extends Node { }

  class AstNodeIdentifierPattern extends Node { }
  class IdentifierPattern extends Node { }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class ArrayLiteral extends Node { }
  class Identifier extends Node { }
}
