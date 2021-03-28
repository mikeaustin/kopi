//
// InterpreterVisitors.js
//

const { Tuple, Range, Function } = require('./classes');

class TupleType {
  constructor(elements) {
    this.elements = elements;
  }

  kopiApply(args, scope, visitors) {
    // console.log(args);

    return {
      value: new Tuple(args.values),
      scope
    };
  }
}

class TypeDefinition {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  kopiApply(args, scope, visitors) {
    const evaluatedType = visitors.visit(this.type, scope).value;

    return {
      value: evaluatedType.kopiApply(args, scope).value,
      scope
    };
  }
}

//

class InterpreterError extends Error {
  constructor(message) {
    super(message);

    this.name = 'InterpreterError';
  }
}

class RuntimeError extends Error {
  constructor(message) {
    super(message);

    this.name = 'RuntimeError';
  }
}

class Visitors {
  visit(node, scope) {
    if (node === null) {
      return { value: undefined };
    }

    // console.log('>>>', node);
    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new InterpreterError(`No AST visitor for '${node.constructor.name}'`);
    }
  }
}

class InterpreterVisitors extends Visitors {
  AstNode({ expr }, scope) {
    return { value: expr, scope };
  }

  TypeDefinition({ pattern, expr }, scope) {
    // console.log('TypeDefinition', pattern, expr);
    return {
      value: undefined,
      // scope: { ...scope, [pattern.name]: this.visit(expr, scope).value }
      scope: { ...scope, [pattern.name]: new TypeDefinition(pattern.name, expr) }
    };
  }

  TupleType({ elements }, scope) {
    console.log('TupleType');

    return {
      value: new TupleType(elements),
      scope
    };

    // return {
    //   value: new TupleType(elements.map(value => this.visit(value, scope).value), fields),
    //   scope
    // };
  }

  Block({ statements }, scope) {
    return statements.reduce(({ value, scope }, statement) => {
      const result = this.visit(statement, scope);

      return {
        value: result.value,
        scope: { ...scope, ...result.scope }
      };
    }, { value: undefined, scope });
  }

  Assignment({ pattern, expr }, scope) {
    if (!pattern.match) {
      throw new InterpreterError(`No match defined for pattern '${pattern.constructor.name}'`);
    }

    const value = pattern.constructor.name === 'FunctionPattern' ? expr : this.visit(expr, scope).value;

    const matches = pattern.match(value, scope, Function);

    if (matches === null) {
      throw new RuntimeError(`Couldn’t match on value '${value}'`);
    }

    // console.log('Assignment matches', matches);

    return {
      value: undefined,
      scope: { ...scope, ...matches }
    };
  }

  PipeExpression({ left, right }, scope) {
    const evaluatedExpr = this.visit(left, scope).value;
    const evaluatedArgs = this.visit(right.args, scope).value;

    return {
      value: evaluatedExpr[right.expr.name].kopiApply(evaluatedArgs, scope, this).value,
      scope
    };
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope).value;
    const evaluatedExpr = this.visit(expr, scope).value;

    // console.trace('Apply', evaluatedExpr, evaluatedArgs);

    if (evaluatedExpr instanceof Tuple && evaluatedExpr.values.length === 0) {
      return { value: evaluatedExpr, scope };
    }

    const result = evaluatedExpr.kopiApply(evaluatedArgs, scope, this);

    return { value: result.value, scope: { ...scope, ...result.scope } };
  }

  OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = this.visit(left, scope).value;
    const evaluatedRight = this.visit(right, scope).value;

    if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
      switch (op) {
        case '+': return { value: evaluatedLeft + evaluatedRight, scope };
        case '-': return { value: evaluatedLeft - evaluatedRight, scope };
        case '*': return { value: evaluatedLeft * evaluatedRight, scope };
      }
    }

    if (evaluatedLeft instanceof Tuple && evaluatedLeft.values.length === 0) {
      return { value: evaluatedRight, scope };
    }

    if (evaluatedRight instanceof Tuple && evaluatedRight.values.length === 0) {
      return { value: evaluatedLeft, scope };
    }

    return { value: evaluatedLeft[op](evaluatedRight), scope };
  }

  TupleExpression({ elements, fields }, scope) {
    return {
      value: new Tuple(elements.map(value => this.visit(value, scope).value), fields),
      scope
    };
  }

  RangeExpression({ from, to }, scope) {
    return {
      value: new Range(this.visit(from, scope).value, this.visit(to, scope).value),
      scope
    };
  }

  FunctionExpression({ params, statements }, scope) {
    return {
      value: new Function(scope, params, statements),
      scope
    };
  }

  FieldExpression({ expr, field }, scope) {
    return {
      value: this.visit(expr, scope).value[field.name || field.value],
      scope
    };
  }

  // TuplePattern({ elements }, scope) {
  //   return {
  //     value: elements.map(value => this.visit(value, scope).value),
  //     scope
  //   };
  // }

  Literal({ value }) {
    return { value: value };
  }

  Typename({ name }, scope) {
    if (!(name in scope)) {
      throw new RuntimeError(`Type '${name}' is not defined`);
    }

    return { value: scope[name].kopiGet ? scope[name].kopiGet() : scope[name], scope };
  }

  Identifier({ name }, scope) {
    if (!(name in scope)) {
      throw new RuntimeError(`Variable '${name}' is not defined`);
    }

    return { value: scope[name].kopiGet ? scope[name].kopiGet() : scope[name], scope };
  }
}

module.exports = {
  default: InterpreterVisitors
};
