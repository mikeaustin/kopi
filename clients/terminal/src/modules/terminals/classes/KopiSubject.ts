import { addTraits, KopiValue } from '../../../modules/shared';
import { KopiArray } from '../../../modules/terminals/classes';

import { Deferred } from '../../../modules/utils';

import KopiIterable from '../../operators/traits/KopiIterable';

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
