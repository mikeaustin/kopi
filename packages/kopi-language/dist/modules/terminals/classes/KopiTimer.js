import { addTraits } from '../../../modules/shared.js';
import { KopiValue } from '../../../modules/shared.js';
import { KopiNumber } from '../../../modules/terminals/classes/index.js';
import KopiIterable from '../traits/KopiIterable.js';
import { Deferred } from '../../../modules/utils.js';
class KopiTimer extends KopiValue {
    constructor(msec) {
        super();
        this.msec = msec;
    }
    *[Symbol.asyncIterator]() {
        let deferred = new Deferred();
        setInterval(() => {
            deferred.resolve(new KopiNumber(Date.now()));
            deferred = new Deferred();
        }, this.msec);
        while (true) {
            yield deferred;
        }
    }
}
addTraits([KopiIterable], KopiTimer);
export default KopiTimer;
