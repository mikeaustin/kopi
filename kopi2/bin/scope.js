const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');

let scope = {
  true: true,
  false: false,
  env: new class extends Function {
    escape() {
      Object.entries(scope).forEach(([name, value]) => console.log(name, value.help));

      return '';
    }
  },
  help: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.help.trim().split('\n').map(line => line.trim()).join('\n'));
    }
  },
  source: new class extends Function {
    apply(arg, scope, visitors) {
      if (arg.body) {
        console.log(printCodeVisitors.visitNode(arg));
      } else {
        console.log('<native function>');
      }
    }
  },
  type: new class extends Function {
    apply(arg, scope, visitors) {
      return arg.type;
    }
  },
  inspect: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(Object.prototype.inspect.apply(arg));
    }
  },
  not: new class extends Function {
    apply(arg, scope, visitors) {
      return !arg;
    }
  },
  even: new class extends Function {
    help = `
      even (value: Number) => Boolean
      Return true if number is even, else return false.
    `;
    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  },
  union: new class extends Function {
    apply(arg, scope, visitors) {
      return (typeof arg === 'string' ? Number(arg) : arg) % 2 === 0;
    }
  },
  print: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  },
};

module.exports = {
  default: scope
};
