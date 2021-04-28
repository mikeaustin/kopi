const { Function, Tuple, Range, IdentifierPattern } = require('../src/visitors/classes');
const { default: PrintCodeVisitors } = require('../src/visitors/PrintCodeVisitors');

const printCodeVisitors = new PrintCodeVisitors();

const doc = strings => strings[0].trim().split('\n').map(line => line.trim()).join('\n');

let scope = {
  image: new class extends Function {
    apply(arg, source, visitor) {
      const image = new Image();
      image.src = arg;

      return image;
    }
  },
  true: true,
  false: false,
  help: new class extends Function {
    constructor() {
      super();

      this.help = doc`
        Shows top-level functions available.
      `;
    }

    escape() {
      console.log('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––');
      Object.entries(scope).filter(([name, value]) => value instanceof Function).forEach(([name, value], index) => {
        if (index > 0) console.log('\t\t––––––––––––––––––––––––––––––––––––––––––––––––––');
        console.log(`${name}\r\t\t${value.help?.split('\n')[0] ?? 'No help available.'}`);
        value.type && console.log(`\t\t${value.type.escape()}`);
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
    constructor() {
      super();

      this.help = doc`
        Returns true if number is even, else false.
        Detailed documentation...
      `;
    }

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
    constructor() {
      super();

      this.help = doc`
        Write's all arguments to the console.
      `;
    }

    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  },
  test: new class extends Function {
    apply(arg, scope, visitors) {
      return arg;
    }
  },
  _methods: new Map([
    [Number, {
      toString: new class extends Function {
        apply() { return this.toString(); }
      },
      mapTo: new class extends Function {
        *apply([to, step, mapper], scope, visitors) {
          const lastIndex = (to - this) / step;

          for (let index = 0; index <= lastIndex; ++index) {
            yield mapper.apply(index * step + this, scope, visitors);
          }
        }
      },
    }],
    [String, {
      toString: new class extends Function {
        apply() { return this.toString(); }
      },
      mapTo: new class extends Function {
        *apply([to, step, mapper], scope, visitors) {
          const last = String.fromCharCode(to.codePointAt(0));

          for (let index = 0; String.fromCharCode(this.codePointAt(0) + index) <= last; index += step) {
            yield mapper.apply(String.fromCharCode(this.codePointAt(0) + index), scope, visitors);
          }
        }
      },
    }],
    [Range, {
      map: new class extends Function {
        apply(mapper, scope, visitors) {
          return [...scope._methods.get(this.from.constructor)['mapTo'].apply.call(
            this.from, [this.to, this.step, mapper], scope, visitors
          )];
        }
      }
    }],
  ]),
};

module.exports = {
  default: scope
};
