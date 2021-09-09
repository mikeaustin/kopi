class NoneType {
  get name() {
    return `None`;
  }

  isSupertypeOf(type) {
    return false;
  }

  isSubtypeOf(type) {
    return true;
  }
}

module.exports = NoneType;
