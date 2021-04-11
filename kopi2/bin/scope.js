const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');
const { default: PrintCodeVisitors } = require('../src/visitors/PrintCodeVisitors');

const printCodeVisitors = new PrintCodeVisitors();

const doc = strings => strings[0].trim().split('\n').map(line => line.trim()).join('\n');

let scope = {
  true: true,
  false: false,
  help: new class extends Function {
    help = doc`
      Shows top-level functions available.
    `;

    escape() {
      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');
      Object.entries(scope).filter(([name, value]) => value instanceof Function).forEach(([name, value], index) => {
        if (index > 0) console.log('\t\t––––––––––––––––––––––––––––––––––––––––––––––––––');
        console.log(`${name}\r\t\t${value.help?.split('\n')[0] ?? 'No help available.'}`);
        console.log(`\t\t${value.type.escape()}`);
      });
      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');

      return 'Type \'help\' <function> for detailed help.';
    }

    apply(arg, scope, visitors) {
      const help = arg.help?.split('\n') ?? [];

      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');
      console.log(help[0] ?? 'No help available.');
      console.log(`${arg.type.escape()}`);
      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');
      console.log(help[1] ?? 'No detailed help available.');
      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');
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
    help = doc`
      Returns true if number is even, else false.
      Detailed documentation...
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
    help = doc`
      Write's all arguments to the console.
    `;
    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  },
  test: new class extends Function {
    apply(arg, scope, visitors) {
      return arg;
    }
  },
};

module.exports = {
  default: scope
};
