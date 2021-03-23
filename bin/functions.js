let functions = {
  print: {
    kopiApply: (args, scope) => ({
      value: console.log(args),
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
          const func = funcs.values.find(func => Object.values(func.params.match(value)).length !== 0);

          return {
            value: func && func.kopiApply(value, scope, visitors).value,
            scope
          };
        }
      },
      scope
    })
  },
  id: {
    kopiApply: (args) => {
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
