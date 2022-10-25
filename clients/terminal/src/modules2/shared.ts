import * as util from 'util';

class RawASTNode {
  [key: string]: any;
}

class ASTNode {
  constructor(location: {}) {
    // this.location = location;
  }

  location: {} = {};
}

class KopiValue {
  async inspect() {
    return util.inspect(this, {
      depth: null,
    });
  }
}

interface Environment {
  [name: string]: KopiValue;
}

export {
  RawASTNode,
  ASTNode,
  KopiValue,
  type Environment,
};
