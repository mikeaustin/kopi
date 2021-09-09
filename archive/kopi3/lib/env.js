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
  true: true,
  even: (_args, env, visitors) => {
    const args = visitors.visitNode(_args, env);

    return args % 2 === 0;
  }
};

module.exports = env;
