Boolean.prototype.inspect = function () {
  return `${this}`;
};

Number.prototype.inspect = function () {
  return `${this}`;
};

String.prototype.inspect = function () {
  return `"${this}"`;
};

Function.prototype.inspect = function () {
  return `<function>`;
};

const env = {
  version: '0.0.1',
  even: (_args, env, visitors) => {
    const args = visitors.visitNode(_args, env);

    return args % 2 === 0;
  }
};

module.exports = env;
