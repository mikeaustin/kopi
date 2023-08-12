//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x)".
//

{
  function Function(parameter, bodyExpression, environment) {
    this.parameter = parameter;
    this.bodyExpression = bodyExpression;
    this.closure = environment;

    this.apply = (thisArg, [argument, environment]) => {
      return evaluate(this.bodyExpression, {
        ...this.closure,
        [this.param.name]: argument
      })
    }
  }

  const operators = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const visitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operators[operator](leftValue, rightValue, environment);
    },

    FunctionExpression({ parameter, bodyExpression }, environment) {
      return new Function(parameter, bodyExpression, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluate(node) {
    const environment = {};

    return visitors[node.type](node);
  }
}

Program
  = expression:Expression {
      return evaluate(expression);
    }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _
    operator:("+" / "-") _
    rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:PrimaryExpression _
    operator:("*" / "/") _
    rightExpression:PrimaryExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / PrimaryExpression

PrimaryExpression
  = "(" _ expression:Expression _ ")" {
    return expression;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = parameter:Identifier _ "=>" _ bodyExpression:Expression {
      return {
        type: 'FunctionExpression',
        parameter,
        bodyExpression
      };
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }

Identifier "identifier"
  = [a-z]+ {
      return {
        type: 'Identifier',
        name: text()
      };
    }

_ "whitespace"
  = [ \t]*
