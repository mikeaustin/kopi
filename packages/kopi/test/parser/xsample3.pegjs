//
// These rules allow us to parse 1 + 2 with or without spaces
//

{
  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right
  };
}

AddExpression
  = left:Integer _ op:("+" / "-") _ right:Integer {
      return operators[op](left, right);
    }

Integer
  = value:[0-9]+ {
    return Number(value);
  }

_ "whitespace"
  = [ \t]*
