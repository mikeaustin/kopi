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

  const extensionMethod = globalThis.methodsStack[globalThis.methodsStack.length - 1].get(left.constructor)?.[op];

  if (extensionMethod) {
    const func = await extensionMethod.apply(undefined, [left, scope, visitors]);

    return func.apply(undefined, [right, scope, visitors]);

  }

  if (!left[op]) {
    throw Error(`Operator '${op}' not found on value ${await left.inspectAsync()}`);
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

  if (!right[op]) {
    throw Error(`Operator '${op}' not found on value ${await right.inspectAsync()}`);
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

export {
  applyBinaryOperator,
  applyUnaryOperator,
  asyncMap,
};
