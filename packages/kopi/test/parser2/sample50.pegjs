{
  const visitors = {
    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function visit(node) {
    return visitors[node.type](node);
  }
}

Program
  = number:NumericLiteral {
      return visit(number);
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: 'NumericLiteral', value: Number(value)
      });
    }
