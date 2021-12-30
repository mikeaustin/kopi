//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x) (3 + 4)".
//

{
  class Function {
    constructor(parameter, expression, environment) {
      this.parameter = parameter;
      this.expression = expression;
      this.environment = environment;
    }

    apply(thisArg, [argument, _]) {
      return visit(this.expression, {
        ...this.environment,
        [this.parameter.name]: argument
      })
    }
  }

  const operatorFunctions = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const visitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = visit(leftExpression, environment);
      const rightValue = visit(rightExpression, environment);

      return operatorFunctions[operator](leftValue, rightValue, environment);
    },

    ApplyExpression({ expression, argument }, environment) {
      const expressionValue = visit(expression, environment);
      const argumentValue = visit(argument, environment);

      return expressionValue.apply(undefined, [argumentValue, environment]);
    },

    FunctionExpression({ parameter, expression }, environment) {
      return new Function(parameter, expression, environment);
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
  = expression:AddExpression {
      const environment = {};

      return visit(expression, environment);
    }

AddExpression
  = leftExpression:MultiplyExpression _ operator:("+" / "-") _ rightExpression:MultiplyExpression {
      return ({
        type: "OperatorExpression",
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      });
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:ApplyExpression _ operator:("*" / "/") _ rightExpression:ApplyExpression {
      return ({
        type: "OperatorExpression",
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      });
    }
  / ApplyExpression

ApplyExpression
  = expression:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expression, [, argument]) => ({
        type: "ApplyExpression",
        expression,
        argument
      }), expression);
    }

PrimaryExpression
  = "(" expression:AddExpression ")" {
    return expression;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = parameter:Identifier _ "=>" _ expression:AddExpression {
      return ({
        type: "FunctionExpression",
        parameter,
        expression
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
