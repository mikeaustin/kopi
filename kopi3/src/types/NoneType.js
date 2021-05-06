class NoneType {
  name = `None`;

  isSupertypeOf(type) {
    return false;
  }

  isSubtypeOf(type) {
    return true;
  }
}

module.exports = {
  NoneType,
};
