async function applyBinaryOperator(op, left, right, scope, visitors) {
  if (typeof left === 'number' && typeof right === 'number') {
    switch (op) {
      case 'negate': return -right;
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '==': return left === right;
      case '!=': return left !== right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '>': return left > right;
    }
  }

  const extensionMethod = globalThis.methods[globalThis.methods.length - 1].get(left.constructor)?.[op];

  if (extensionMethod) {
    const func = await extensionMethod.apply(undefined, [left, scope, visitors]);

    return func.apply(undefined, [right, scope, visitors]);

  }

  return left[op].apply(left, [right, scope, visitors]);
}

async function applyUnaryOperator(op, right, scope, visitors) {
  if (typeof right === 'number') {
    switch (op) {
      case 'negate': return -right;
    }
  }

  if (typeof right === 'boolean') {
    switch (op) {
      case 'not': return !right;
    }
  }

  return right[op].apply(right, [undefined, scope, visitors]);
}

async function asyncMap([iterable, func], scope, visitors) {
  const accum = [];

  for (let element of iterable) {
    accum.push(await func.apply(undefined, [await element, scope, visitors]));
  }

  return accum;
}

module.exports = {
  applyBinaryOperator,
  applyUnaryOperator,
  asyncMap,
};
