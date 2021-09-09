class AnyType {
  get name() {
    return `Any`;
  }

  escape() {
    return this.name;
  }

  isSupertypeOf(type) {
    return true;
  }

  isSubtypeOf(type) {
    return false;
  }
}

module.exports = AnyType;
