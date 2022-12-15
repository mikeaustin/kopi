import { addTraits, KopiValue } from '../../../modules/shared.js';
import { KopiArray } from '../../../modules/terminals/classes/index.js';

import { Deferred } from '../../../modules/utils.js';

import KopiIterable from '../traits/KopiIterable.js';

class KopiSubject extends KopiValue {
  static emptyValue = () => new KopiArray([]);

  promise: Deferred;

  constructor(value: KopiValue) {
    super();

    this.promise = new Deferred();
  }

  set(value: KopiValue) {
    console.log('KopiObserver.set');
    (this.promise as any).resolve(value);
    this.promise = new Deferred();

    return this;
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      yield this.promise;
    }
  }
}

addTraits([KopiIterable], KopiSubject);

export default KopiSubject;
