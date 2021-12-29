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

  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right,
    ['*']: (left, right) => left * right,
    ['/']: (left, right) => left / right,
  }

  const visitors = {
    OperatorExpression: ({ operator, left, right }, environment) => {
      const evaluatedLeft = visit(left, environment);
      const evaluatedRight = visit(right, environment);

      return operators[operator](evaluatedLeft, evaluatedRight, environment);
    },

    ApplyExpression({ expression, argument }, environment) {
      const evaluatedExpr = visit(expression, environment);
      const evaluatedArgs = visit(argument, environment);

      return evaluatedExpr.apply(undefined, [evaluatedArgs, environment]);
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
  = left:MultiplyExpression _ operator:("+" / "-") _ right:MultiplyExpression {
      return ({
        type: "OperatorExpression",
        operator: operator,
        left: left,
        right: right
      });
    }
  / MultiplyExpression

MultiplyExpression
  = left:ApplyExpression _ operator:("*" / "/") _ right:ApplyExpression {
      return ({
        type: "OperatorExpression",
        operator: operator,
        left: left,
        right: right
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
