class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

const operatorDefaults = { ['+']: 0, ['*']: 1 };

class TypeAssignment extends Node { }
class TupleTypeExpression extends Node { }
class TypeApplyExpression extends Node { }

class Block extends Node { }
class Assignment extends Node { }

class PipeExpression extends Node { }
class OperatorExpression extends Node { }
class UnaryExpression extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class ArrayExpression extends Node { }
class ApplyExpression extends Node {
  // inspectAsync() {
  //   return `${util.inspect(this)}`;
  // }

  async apply(thisArg, [_receiver, scope, visitors]) {
    const receiver = _receiver.getElementsArray?.()?.length === 0
      ? operatorDefaults[this.expr.name]
      : await _receiver;

    return receiver[this.expr.name].apply(receiver, [
      await visitors.visitNode(this.args, scope),
      scope,
      visitors,
    ]);
  }
}
class DictExpression extends Node { }
class RangeExpression extends Node { }
class MemberExpression extends Node { }
class ParenthesesExpression extends Node { }

class FunctionPattern extends Node { }
class TuplePattern extends Node { }
class ArrayLiteralPattern extends Node { }
class BooleanLiteralPattern extends Node { }
class NumericLiteralPattern extends Node { }
class StringLiteralPattern extends Node { }
class IdentifierPattern extends Node { }

class Typename extends Node { }
class NumericLiteral extends Node { }
class StringLiteral extends Node { }
class BooleanLiteral extends Node { }
class AstLiteral extends Node { }
class Identifier extends Node {
  async apply(thisArg, [value]) {
    const evaluatedValue = value.getElementsArray?.()?.length === 0
      ? operatorDefaults[this.name]
      : await value;

    return evaluatedValue[this.name].apply(evaluatedValue, []);
  }
}
