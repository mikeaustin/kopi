class AnyType {
  name = `Any`;

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

module.exports = {
  AnyType,
};
