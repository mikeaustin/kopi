// Simple Arithmetics Interpreter
// ==============================
//
// Parses syntax into an AST, then interprets the AST directly.
// Accepts expressions such as "2 * (3 + 4)" and computes their value.
//
// (f => f 5) (x => x * x)

{
  function visit(node, env) {
    return visitors[node.type](node, env);
  }

  const operators = {
    ['+']: (left, right, env) => visit(left, env) + visit(right, env),
    ['*']: (left, right, env) => visit(left, env) * visit(right, env),
  }

  const visitors = {
    OperatorExpression: ({ op, left, right }, env) => {
      return operators[op](left, right, env);
    },

    FunctionExpression({ param, body }, env) {
      return new Function(param, body, env);
    },

    ApplyExpression({ expr, arg }, env) {
      const evaluatedExpr = visit(expr, env);
      const evaluatedArgs = visit(arg, env);

      return evaluatedExpr.apply(undefined, [evaluatedArgs, env]);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, env) => {
      return env[name];
    }
  }

  function Function(param, body, closure) {
    this.param = param;
    this.body = body;
    this.closure = closure;

    this.apply = (thisArg, [arg, env]) => {
      return visit(this.body, {
        ...this.closure,
        [this.param.name]: arg
      })
    }
  }

  let env = { even: (n) => n % 2 === 0 };
}

//
// First rule that is run. In this case, interpret the expression.
//

Program
  = expr:Expression {
      return visit(expr, env);
    }

//
// Alias so we can add or remove rules more easily later.
//

Expression
  = AddExpression

//
// Left-associative using looping (* operator)
//

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

//
// Higher precedence than AddExpression
//

MultiplyExpression
  = head:ApplyExpression tail:(_ ("*" / "/") _ ApplyExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

//
//
//

ApplyExpression
  = expr:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expr, [, arg]) => ({
        type: "ApplyExpression", expr, arg
      }), expr);
    }

//
//
//

PrimaryExpression
  = "(" _ expr:Expression _ ")" { return expr; }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = param:Identifier _ "=>" _ body:Expression {
      return ({ type: "FunctionExpression", param, body });
    }

NumericLiteral "integer"
  = [0-9]+ {
      return ({
        type: "NumericLiteral", value: Number(text())
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
