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

  class IdentifierPattern extends Node {
    inspect() {
      return this.name
    }

    matchValue(value) {
      return {
        [this.name]: value
      };
    }

    matchType(type) {
      return {
        [this.name]: type
      };
    }
  }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class Identifier extends Node { }
}
