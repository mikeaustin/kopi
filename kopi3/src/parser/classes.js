function extractList(list, index) {
  return list.map(function (element) { return index !== undefined ? element[index] : null; });
}

function buildList(head, tail, index) {
  return [...(head !== undefined ? [head] : [])].concat(extractList(tail, index));
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

//
// Patterns
//

class TuplePattern extends Node { }
class FunctionPattern extends Node { }
class IdentifierPattern extends Node {
  matchValue(_expr, env, visitors) {
    const value = visitors.visitNode(_expr, env);

    return {
      [this.name]: value
    };
  }

  matchType(_expr, context, visitors) {
    const type = visitors.visitNode(_expr, context);

    return {
      [this.name]: type
    };
  }
}

class NumericLiteral extends Node { }
class StringLiteral extends Node { }
class ArrayLiteral extends Node { }

class Identifier extends Node { }

if (typeof module !== 'undefined') {
  module.exports = {
    IdentifierPattern
  };
}
