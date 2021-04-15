class AnyType {
  get name() {
    return `Any`;
  }

  escape() {
    return this.name;
  }

  includesType(type) {
    return true;
  }
}

module.exports = {
  AnyType,
};
