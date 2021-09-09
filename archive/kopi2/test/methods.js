const merge = (funcsObjectA, funcsObjB) => {
  return {
    ...funcsObjectA,
    ...Object.entries(funcsObjB).reduce((mergedFuncs, [name]) => ({
      ...mergedFuncs,
      [name]: new Map([
        ...(funcsObjectA[name] || new Map()),
        ...funcsObjB[name]
      ])
    }), {})
  };
};

_ = {
  toString: new Map([[Number, function () { return this.toString(); }]])
};

_ = merge(_, {
  toString: new Map([[String, function () { return this.valueOf(); }]])
});

_ = merge(_, {
  abs: new Map([[Number, function () { return Math.abs(this.valueOf()); }]])
});

// console.log(_);
console.log(_.toString.get(Number).apply(1));
console.log(_.toString.get(String).apply("x"));
console.log(_.abs.get(Number).apply(-1));

/*

this: Number toString () = this.toString ()

[head, *tail] String capitalize = (head | toUpper) ++ tail

5 | toString

toString.Number
toString.String
abs.Number

Number.toString
String.toString
Number.abs

*/


const merge2 = (typeMapA, typeMapB) => {
  return new Map([
    ...typeMapA,
    ...[...typeMapB].reduce((mergedTypeMap, [type, value]) => (
      new Map([...mergedTypeMap, [type, {
        ...(typeMapA.get(type) || {}),
        ...typeMapB.get(type)
      }]])
    ), new Map())
  ]);
};

__ = new Map();

__ = merge2(__, new Map([
  [Number, { toString: function () { return this.toString(); } }]
]));

__ = merge2(__, new Map([
  [String, { toString: function () { return this.valueOf(); } }]
]));

__ = merge2(__, new Map([
  [Number, { abs: function () { return Math.abs(this); } }]
]));

// console.log(__);
console.log(__.get(Number).toString.apply(1));
console.log(__.get(String).toString.apply("x"));
console.log(__.get(Number).abs.apply(-1));


const merge3 = (typesMap, [type, funcsObject]) => {
  return new Map([
    ...typesMap,
    ...new Map([[type, {
      ...(typesMap.get(type) || {}),
      ...funcsObject
    }]])
  ]);
};

__ = new Map();

__ = merge3(__, [Number, {
  toString: function () { return this.toString(); }
}]);

__ = merge3(__, [String, {
  toString: function () { return this.valueOf(); }
}]);

__ = merge3(__, [Number, {
  abs: function () { return Math.abs(this); }
}]);

// console.log(__);
console.log(__.get(Number).toString.apply(1));
console.log(__.get(String).toString.apply("x"));
console.log(__.get(Number).abs.apply(-1));


const extend = (typesMap, type, funcsObject) => {
  return new Map([
    ...typesMap, [type, {
      ...(typesMap.get(type) || {}),
      ...funcsObject
    }]
  ]);
};

_methods = new Map();

_methods = extend(_methods, Number, {
  toString: function () { return this.toString(); }
});

_methods = extend(_methods, String, {
  toString: function () { return this.valueOf(); }
});

_methods = extend(_methods, Number, {
  abs: function () { return Math.abs(this); }
});

// console.log(_methods);
console.log(($ = 1, _methods.get($.constructor).toString.apply($)));
console.log(($ = "x", _methods.get($.constructor).toString.apply($)));
console.log(($ = -3, _methods.get($.constructor).abs.apply($)));
