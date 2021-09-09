class NumberType {
  get name() {
    return `Number`;
  }

  isSupertypeOf(type) {
    return false;
  }

  isSubtypeOf(type) {
    return true;
  }
}

module.exports = NumberType;
