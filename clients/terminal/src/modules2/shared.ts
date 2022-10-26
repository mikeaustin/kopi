import * as util from 'util';

class RawASTNode {
  [key: string]: any;
}

class KopiValue {
  async inspect() {
    return util.inspect(this, {
      depth: null,
    });
  }
}

class ASTNode extends KopiValue {
  constructor(location: {}) {
    super();

    // this.location = location;
  }

  async inspect() {
    return util.inspect(this, {
      depth: null,
    });
  }

  location: {} = {};
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
