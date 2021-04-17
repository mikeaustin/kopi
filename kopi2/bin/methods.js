const merge = (a, b) => {
  return {
    ...a,
    ...Object.entries(b).reduce((obj, [name]) => ({
      ...obj,
      [name]: new Map([...(a[name] || new Map()), ...b[name]])
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

const merge2 = (a, b) => {
  return new Map([
    ...a,
    ...[...b].reduce((map, [name, value]) => (
      new Map([...map, [name, { ...(a.get(name) || {}), ...b.get(name) }]])
    ), new Map())
  ]);
};

__ = new Map();

__ = merge2(__, new Map([[Number, { toString: function () { return this.toString(); } }]]));

__ = merge2(__, new Map([[String, { toString: function () { return this.valueOf(); } }]]));

__ = merge2(__, new Map([[Number, { abs: function () { return Math.abs(this); } }]]));

// console.log(__);
console.log(__.get(Number).toString.apply(1));
console.log(__.get(String).toString.apply("x"));
console.log(__.get(Number).abs.apply(-1));
