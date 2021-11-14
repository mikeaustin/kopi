async function applyOperator(op, left, right, scope, visitors) {
  if (typeof left === 'number' && typeof right === 'number') {
    switch (op) {
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

  const extensionMethod = global.methods[global.methods.length - 1].get(left.constructor)?.[op];

  if (extensionMethod) {
    const func = await extensionMethod.apply(undefined, [left, scope, visitors]);

    return func.apply(undefined, [right, scope, visitors]);

  }

  return left[op].apply(left, [right, scope, visitors]);
}

async function asyncMap([iterable, func], scope, visitors) {
  const accum = [];

  for (let element of iterable) {
    accum.push(await func.apply(undefined, [await element, scope, visitors]));
  }

  return accum;
};

async function main() {
  console.log(
    await asyncMap([[Promise.resolve(1), Promise.resolve(2)], (x) => x * x])
  );
}

// main();

module.exports = {
  applyOperator,
  asyncMap,
};
