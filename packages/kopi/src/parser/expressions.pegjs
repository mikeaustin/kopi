Expression
  = NextRule

LowPrecedenceApplyExpression
  = head:NextRule tail:(_ "$" _ Expression)* {
      return tail.reduce((expr, [, op, , args]) => (
        new ApplyExpression({ expr, args })
      ), head);
    }

PipeExpression
  = head:NextRule tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

TupleExpression
  = head:((Identifier ":")? _ NextRule) tail:(_ "," _ (Identifier ":")? NextRule)* {
      return tail.length === 0 && head[0] === null ? head[2] : new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[2]]),
        fields: tail.reduce((elements, element) => [
          ...elements,
          element[3] && element[3][0].name
        ], [head[0] && head[0][0].name]),
      });
  }

ApplyExpression
  = expr:("+" / "-" / "*" / "/" / "%") _ args:(_ NumericLiteral)+ {
      return args.reduce((expr, args) => (
        new ApplyExpression({ expr, args: args[1] })
      ), new Identifier({ name: expr[0] ?? expr }))
    }
  / expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

RangeExpression
  = from:NextRule _ ".." _ to:NextRule {
      return new RangeExpression({ from, to });
    }
  / NextRule

CalculatedMemberExpression
  = head:NextRule tail:(".(" _ Expression _ ")")* {
      return tail.reduce((expr, [, , args]) => (
        new PipeExpression({
          left: expr,
          right: new ApplyExpression({ expr: new Identifier({ name: '_get' }), args })
        })
      ), head)
    }

MemberExpression
  = head:NextRule tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expr, [, ident]) => (
        new MemberExpression({ expr, member: ident?.name ?? ident.value })
      ), head)
    }

PrimaryExpression
  = FunctionExpression
  / ParenthesizedTuple
  / ArrayExpression
  / DictExpression
  / _ "{" _ block:Block _ "}" { return block; }
  / NumericLiteral
  / StringLiteral
  / BooleanLiteral
  / AstLiteral
  / Identifier
