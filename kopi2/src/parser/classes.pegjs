{
  function extractList(list, index) {
    return list.map(function(element) { return index !== undefined ? element[index] : null; });
  }

  function buildList(head, tail, index) {
    return [...(head !== undefined ? [head] : []) ].concat(extractList(tail, index));
  }

  class Node {
    constructor(properties) {
      Object.assign(this, properties);
    }
  }

  class AstNode extends Node { }
  class AstIdentifierNode extends Node { }
  class Assignment extends Node { }

  class PipeExpression extends Node { }
  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class RangeExpression extends Node { }
  class OperatorExpression extends Node { }
  class FieldExpression extends Node { }

  class AstNodeIdentifierPattern extends Node { }
  class IdentifierPattern extends Node { }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class ArrayLiteral extends Node { }
  class Identifier extends Node { }
}
