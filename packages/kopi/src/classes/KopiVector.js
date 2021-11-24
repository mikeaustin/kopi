class KopiVector {
  constructor(elements = []) {
    this.buffer = new ArrayBuffer(elements.length * 8);
    this.view = new Float64Array(this.buffer, 0, elements.length);
    this.referenceCount = 0;

    for (let index = 0; index < this.view.length; ++index) {
      this.view[index] = elements[index];
    }
  }

  incrementReferenceCount() {
    this.referenceCount = this.referenceCount + 1;
  }

  get x() {
    return this.view[0];
  }

  get y() {
    return this.view[1];
  }

  inspectAsync() {
    return `Vector [${this.view.map((element) => element.toString()).join(', ')}]`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  ['+'](that) {
    if (this.referenceCount === 1) {
      for (let i = 0; i < this.view.length; ++i) {
        this.view[i] += that.view[i];
      }

      return this;
    }

    const buffer = new ArrayBuffer(this.view.length * 8);
    const view = new Float64Array(buffer, 0, this.view.length);

    for (let i = 0; i < this.view.length; ++i) {
      view[i] = this.view[i] + that.view[i];
    }

    return new KopiVector(view);
  }

  ['*'](that) {
    const buffer = new ArrayBuffer(this.view.length * 8);
    const view = new Float64Array(buffer, 0, this.view.length);

    for (let i = 0; i < this.view.length; ++i) {
      view[i] = this.view[i] * that;
    }

    return new KopiVector(view);
  }

  get(index) {
    return this.view[index];
  }

  size() {
    return this.view.length;
  }

  sum() {
    let total = 0;

    for (let index = 0; index < this.view.length; ++index) {
      total += this.view[index];
    }

    return total;
  }

  length() {
    let total = 0;

    for (let index = 0; index < this.view.length; ++index) {
      total += this.view[index] * this.view[index];
    }

    return Math.sqrt(total);
  }
}

module.exports = {
  default: KopiVector,
};
