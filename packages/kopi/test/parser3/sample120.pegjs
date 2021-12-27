//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x) (3 + 4)".
//

{
  class Function {
    constructor(param, body, closure) {
      this.param = param;
      this.body = body;
      this.closure = closure;
    }

    apply(thisArg, [arg, _]) {
      return visit(this.body, {
        ...this.closure,
        [this.param.name]: arg
      })
    }
  }

  const environment = {
    x: 5
  };

  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right,
    ['*']: (left, right) => left * right,
    ['/']: (left, right) => left / right,
  }

  const visitors = {
    OperatorExpression: ({ op, left, right }, environment) => {
      const evaluatedLeft = visit(left, environment);
      const evaluatedRight = visit(right, environment);

      return operators[op](evaluatedLeft, evaluatedRight, environment);
    },

    ApplyExpression({ expr, arg }, environment) {
      const evaluatedExpr = visit(expr, environment);
      const evaluatedArgs = visit(arg, environment);

      return evaluatedExpr.apply(undefined, [evaluatedArgs, environment]);
    },

    FunctionExpression({ param, body }, environment) {
      return new Function(param, body, environment);
    },

    NumericLiteral: ({ value }, _) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function visit(node, environment) {
    return visitors[node.type](node, environment);
  }
}

Program
  = expr:AddExpression {
      return visit(expr);
    }

AddExpression
  = left:MultiplyExpression _ op:("+" / "-") _ right:MultiplyExpression {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
    }
  / MultiplyExpression

MultiplyExpression
  = left:ApplyExpression _ op:("*" / "/") _ right:ApplyExpression {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
    }
  / ApplyExpression

ApplyExpression
  = expr:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expr, [, arg]) => ({
        type: "ApplyExpression",
        expr,
        arg
      }), expr);
    }

PrimaryExpression
  = "(" expr:AddExpression ")" {
    return expr;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = param:Identifier _ "=>" _ body:AddExpression {
      return ({
        type: "FunctionExpression",
        param,
        body
      });
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral",
        value: Number(value)
      });
    }

Identifier "identifier"
  = [a-z]+ {
      return ({
        type: "Identifier",
        name: text()
      })
    }

_ "whitespace"
  = [ \t]*
