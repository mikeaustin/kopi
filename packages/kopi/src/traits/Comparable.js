const Numeric = ({
  compare,
  ['<']: lessThan = (_this) => (that) => {
    switch (_this.compare(that)) {
      case -1: return true;
      default: return false;
    }
  },
}) => ({
  ['<']: lessThan,
});

module.exports = {
  default: Numeric,
  ['+']: (thisArg) => (args, scope, visitors) => Numeric.prototype['+'].apply(thisArg, [args, scope, visitors]),
};

Numeric({
  compare: (_this) => (that) => {
    0;
  },
});
