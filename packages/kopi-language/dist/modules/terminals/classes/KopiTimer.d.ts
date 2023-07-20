import { KopiValue } from '../../../modules/shared.js';
import { Deferred } from '../../../modules/utils.js';
declare class KopiTimer extends KopiValue {
    msec: number;
    constructor(msec: number);
    [Symbol.asyncIterator](): Generator<Deferred, void, unknown>;
}
export default KopiTimer;
