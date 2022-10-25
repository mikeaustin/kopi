Expression
  = AddExpression

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

MultiplyExpression
  = head:FunctionExpression tail:(_ ("*" / "/") _ FunctionExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

FunctionExpression
  = "()" _ "=>" _ bodyExpression:Expression {
      return {
        type: "FunctionExpression",
        parameters: [],
        bodyExpression,
      }
    }
  / PrimaryExpression

PrimaryExpression
  = "(" _ head:Expression tail:(_ "," _ Expression)+ _ ")" {
      return {
        type: 'TupleExpression',
        elements: tail.reduce((elements, [, , , expression]) => [...elements, expression], [head]),
      }
    }
  / "(" _ head:Expression _ ")" {
      return head;
    }
  / "(" _ ")" {
      return {
        type: 'TupleExpression',
        elements: [],
      }
    }
  / NumericLiteral
  / Identifier

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?) {
    return ({
      type: 'NumericLiteral',
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    });
  }

Identifier "identifier"
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ {
      return ({
        type: 'Identifier',
        name: name[0] + name[1].join('')
      });
    }

_ "whitespace"
  = [ \t]*
