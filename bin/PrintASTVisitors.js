const visit = (visitors, node) => {
  if (visitors[node.constructor.name]) {
    return visitors[node.constructor.name](node);
  } else {
    throw new InterpreterError(`No AST visitor for '${node.constructor.name}'`);
  }
};


const parens = (string) => {
  return `\x1b[37;2m(\x1b[0m${string}\x1b[37;2m)\x1b[0m`;
};

const collect = (values, mapper) => {
  return values.reduce((array, item) => {
    const result = mapper(item);

    return result ? [...array, result] : array;
  }, []);
};

class PrintASTVisitors {
  Comment({ value }) {
    return;
    return `# ${value}`;
  }

  Block({ statements }) {
    return collect(statements, statement => visit(this, statement));
  }

  ApplyExpression({ expr, args }) {
    return parens(`${visit(this, expr)} ${visit(this, args)}`);
  }

  TupleExpression({ elements }) {
    return parens(`${elements.map(value => visit(this, value)).join(', ')}`);
  }

  FunctionExpression({ params, statements }) {
    return parens(`${visit(this, params)} => ${collect(statements, statement => visit(this, statement))}`);
  }

  OperatorExpression({ op, left, right }) {
    return parens(`${visit(this, left)} ${op} ${visit(this, right)}`);
  }

  TuplePattern({ elements }) {
    return parens(`${elements.map(value => visit(this, value)).join(', ')}`);
  }

  Identifier({ name }) {
    return name;
  }
};

module.exports = {
  default: PrintASTVisitors
};
