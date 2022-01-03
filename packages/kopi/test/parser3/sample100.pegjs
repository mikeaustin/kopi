//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "2 * (3 + 4)".
//

{
  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right,
    ['*']: (left, right) => left * right,
    ['/']: (left, right) => left / right,
  };

  const visitors = {
    OperatorExpression: ({ op, left, right }) => {
      return operators[op](visit(left), visit(right));
    },

    FunctionExpression({ param, body }, environment) {
      return new Function(param, body, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, env) => {
      return environment[name];
    }
  }

  function visit(node) {
    const environment = {};

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
  / NumericLiteral
  / Identifier

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
