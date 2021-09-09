const Point = function (args) {
  this.x = args[0] || 0;
  this.y = args[1] || 0;
};

Point.prototype.toString = function () {
  return `Point (${this.x}, ${this.y})`;
};

Point.prototype['+'] = function (that) {
  return new Point([this.x + that.x, this.y + that.y]);
};

Point.name = 'Point';

let functions = {
  Point: {
    kopiApply: (args, scope) => {
      return ({
        value: new Point(args),
        scope
      });
    }
  },
  print: {
    kopiApply: (args, scope) => ({
      value: console.log(args.toString()),
      scope
    })
  },
  set: {
    kopiApply: (args, scope) => ({
      value: {
        kopiApply: (value, scope) => ({
          value: undefined,
          scope: { ...scope, [args.name]: value }
        })
      },
      scope
    })
  },
  update: {
    kopiApply: (args, scope, visitors) => ({
      value: {
        kopiApply: (value, scope) => ({
          value: undefined,
          scope: { ...scope, [args.name]: value.kopiApply(scope[args.name], scope, visitors).value }
        })
      },
      scope
    })
  },
  match: {
    kopiApply: (value, scope, visitors) => ({
      value: {
        kopiApply: (funcs, scope) => {
          const func = funcs.values.find(func => func.params.match(value) !== null);

          return {
            value: func && func.kopiApply(value, scope, visitors).value,
            scope
          };
        }
      },
      scope
    })
  },
  type: {
    kopiApply: (args, scope) => {
      return {
        value: scope[args.name],
        scope
      };
    }
  },
  id: {
    kopiApply: (args, scope) => {
      return ({
        value: args,
        scope
      });
    }
  },
  clear: {
    kopiGet: () => {
      console.clear();
    },
    kopiApply: (_, scope) => {
      console.clear();

      return { value: undefined, scope };
    }
  },
  map: {
    kopiApply: (mapper, scope, visitors) => ({
      value: {
        kopiApply: (source, scope) => {
          const value = mapper.constructor.name === 'Identifier'
            ? [...source].reduce((z, x) => [...z, x[mapper.name].apply(x, [])], [])
            : [...source].reduce((z, x) => [...z, mapper.kopiApply(x, scope, visitors).value], []);
          return {
            // value: [...source].reduce((z, x) => [...z, mapper.kopiApply(x, scope, visitors).value], []),
            // value: [...source].reduce((z, x) => [...z, x[mapper.name].apply(x, [])], []),
            value,
            scope
          };
        }
      },
      scope
    })
  },
  even: {
    kopiApply: (value, scope, visitors) => ({
      value: value % 2 === 0,
      scope
    })
  }
};

module.exports = {
  default: functions
};
