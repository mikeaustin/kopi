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

  isSupertypeOf(valueType) {
    return true;
  }

  isSubtypeOf(valueType) {
    return false;
  }
}

module.exports = {
  AnyType,
};
