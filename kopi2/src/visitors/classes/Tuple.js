class Tuple {
  constructor(elements = [], fields = []) {
    this.elements = elements;
    this.fields = fields;
  }

  escape() {
    return `(${this.elements.map(element => element.escape()).join(', ')})`;
  }

  toString() {
    return `${this.elements.join(', ')}`;
  }

  //

  valueForField(field) {
    if (typeof field === 'number') {
      return this.elements[field];
    }

    return this.elements[this.fields.indexOf(field)];
  }
}

module.exports = {
  default: Tuple,
};
