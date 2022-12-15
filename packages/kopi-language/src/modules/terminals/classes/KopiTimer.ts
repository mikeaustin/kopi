import { addTraits } from '../../../modules/shared';

import { KopiValue } from '../../../modules/shared';
import { KopiNumber } from '../../../modules/terminals/classes';

import KopiIterable from '../traits/KopiIterable';

import { Deferred } from '../../../modules/utils';

class KopiTimer extends KopiValue {
  msec: number;

  constructor(msec: number) {
    super();

    this.msec = msec;
  }

  *[Symbol.asyncIterator]() {
    let deferred = new Deferred();

    setInterval(() => {
      (deferred as any).resolve(new KopiNumber(Date.now()));

      deferred = new Deferred();
    }, this.msec);

    while (true) {
      yield deferred;
    }
  }
}

addTraits([KopiIterable], KopiTimer);

export default KopiTimer;
