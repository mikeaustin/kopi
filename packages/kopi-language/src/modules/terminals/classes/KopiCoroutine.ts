import { KopiValue, Context } from '../../../modules/shared.js';

import { KopiFunction, KopiTuple } from '../../../modules/terminals/classes/index.js';

import { Deferred } from '../../utils.js';

class KopiCoroutine extends KopiValue {
  deferred: Deferred[];

  constructor() {
    super();

    this.deferred = [new Deferred(), new Deferred()];
  }

  async yield(func: KopiFunction, context: Context) {
    const data = await this.deferred[0] as KopiValue;
    this.deferred[0] = new Deferred();

    const value = await func.apply(KopiTuple.empty, [data, context]);

    (this.deferred[1] as any).resolve(value);
    this.deferred[1] = new Deferred();
  }

  async send(value: KopiValue) {
    (this.deferred[0] as any).resolve(value);

    const x = await this.deferred[1];
    this.deferred[1] = new Deferred();

    return x;
  }
}

export default KopiCoroutine;
