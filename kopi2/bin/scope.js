const { Function, Tuple, Range, IdentifierPattern } = require('../src/visitors/classes');
const { default: PrintCodeVisitors } = require('../src/visitors/PrintCodeVisitors');

const printCodeVisitors = new PrintCodeVisitors();

const doc = strings => strings[0].trim().split('\n').map(line => line.trim()).join('\n');

class NumberRangeIterable {
  constructor(from, to, step) {
    this.from = from;
    this.to = to;
    this.step = step;
  }

  *[Symbol.iterator]() {
    const lastIndex = (this.to - this.from) / this.step;

    for (let index = 0; index <= lastIndex; ++index) {
      yield index * this.step + this.from;
    }
  }
}

class StringRangeIterable {
  constructor(from, to, step) {
    this.from = from;
    this.to = to;
    this.step = step;
  }

  *[Symbol.iterator]() {
    for (let index = 0; String.fromCodePoint(this.from.codePointAt(0) + index) <= this.to; index += String.fromCodePoint(this.from.codePointAt(0) + index).length) {
      yield String.fromCodePoint(this.from.codePointAt(0) + index);
    }
  }
}

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
      rangeIterator: new class extends Function {
        apply([to, step]) {
          return new NumberRangeIterable(this, to, step);
        }
      },
    }],
    [String, {
      toString: new class extends Function {
        apply() { return this.toString(); }
      },
      rangeIterator: new class extends Function {
        apply([to, step]) {
          return new StringRangeIterable(this, to, step);
        }
      },
    }],
    [Range, {
      map: new class extends Function {
        apply(mapper, scope, visitors) {
          const iterable = scope._methods.get(this.from.constructor).rangeIterator.apply.call(
            this.from, [this.to, this.step], scope, visitors
          );

          const values = [];

          for (let item of iterable) {
            values.push(mapper.apply(item, scope, visitors));
          }

          return values;
        }
      }
    }],
  ]),
};

module.exports = {
  default: scope
};
