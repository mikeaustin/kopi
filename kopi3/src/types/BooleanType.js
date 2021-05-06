class BooleanType {
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

module.exports = BooleanType;
