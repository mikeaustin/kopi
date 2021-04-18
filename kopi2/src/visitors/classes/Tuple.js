class Tuple {
  constructor(...elements) {
    this.elements = elements;

    elements.forEach((element, index) => {
      this[index] = element;
    });
  }

  escape() {
    return `(${this.elements.map(element => element.escape()).join(', ')})`;
  }

  toString() {
    return `${this.elements.join(', ')}`;
  }
}

module.exports = {
  default: Tuple,
};
