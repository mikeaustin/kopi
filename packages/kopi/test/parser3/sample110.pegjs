//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x)".
//

{
  const environment = {
    x: 5
  };

  function Function(param, body, closure) {
    this.param = param;
    this.body = body;
    this.closure = closure;

    this.apply = (thisArg, [arg, environment]) => {
      return visit(this.body, {
        ...this.closure,
        [this.param.name]: arg
      })
    }
  }

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

    FunctionExpression({ param, body }, environment) {
      return new Function(param, body, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function visit(node) {
    return visitors[node.type](node);
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
  = left:PrimaryExpression _ op:("*" / "/") _ right:PrimaryExpression {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
    }
  / PrimaryExpression

PrimaryExpression
  = "(" expr:AddExpression ")" {
    return expr;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = param:Identifier _ "=>" _ body:AddExpression {
      return ({ type: "FunctionExpression", param, body });
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
        type: "Identifier", name: text()
      })
    }

_ "whitespace"
  = [ \t]*
