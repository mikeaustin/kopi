Expression
  = NextRule

LowPrecedenceApplyExpression
  = head:NextRule tail:(_ "$" _ NextRule)* {
      return tail.reduce((expr, [, op, , args]) => (
        new ApplyExpression({ expr, args })
      ), head);
    }

PipeExpression
  = head:NextRule tail:(_ "|" _ NextRule)* {
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
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

RangeExpression
  = from:NextRule _ ".." _ to:NextRule {
      return new RangeExpression({ from, to });
    }
  / NextRule

MemberExpression
  = head:NextRule tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expr, [, ident]) => (
        new MemberExpression({ expr, member: ident?.name ?? ident.value })
      ), head)
    }

PrimaryExpression
  = FunctionExpression
  / ParenthesizedTuple
  / _ "{" _ block:Block _ "}" { return block; }
  / ArrayExpression
  / NumericLiteral
  / StringLiteral
  / AstLiteral
  / Identifier
