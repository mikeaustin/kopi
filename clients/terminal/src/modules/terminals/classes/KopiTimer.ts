import { addTraits } from '../../../modules/shared';

import { KopiValue } from '../../../modules/shared';
import { KopiNumber } from '../../../modules/terminals/classes';

import KopiIterable from '../traits/KopiIterable';

import { Deferred } from '../../../modules/utils';

class KopiTimer extends KopiValue {
  *[Symbol.asyncIterator]() {
    let deferred = new Deferred();

    setInterval(() => {
      (deferred as any).resolve(new KopiNumber(Date.now()));

      deferred = new Deferred();
    }, 500);

    for (; ;) {
      yield deferred;
    }
  }
}

addTraits([KopiIterable], KopiTimer);

export default KopiTimer;
