class Option {
  static create = _default => value => new Option(value, _default);

  constructor(value, _default) {
    this.value = value;
    this._default = _default;
  }

  map(mapper) {
    return this.value === undefined ? this._default : mapper(this.value);
  }
}

String.Option = Option.create("");

[head, tail] = [String.Option("f"), "oo"];
console.log(
  head.map(x => x.toUpperCase()).concat(tail)
)

[head, tail] = [String.Option(), "oo"];
console.log(
  head.map(x => x.toUpperCase()).concat(tail)
);

/*

(head | map (x) => (x | toUpper)) ++ tail

(head | map .toUpper) ++ tail

(head | toUpper) ++ tail

https://stackoverflow.com/questions/36257132/when-should-i-use-option-emptya-and-when-should-i-use-none-in-scala

https://stackoverflow.com/questions/5260298/how-can-i-obtain-the-default-value-for-a-type-in-scala

*/
