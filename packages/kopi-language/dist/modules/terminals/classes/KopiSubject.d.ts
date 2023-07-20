import { KopiValue } from '../../../modules/shared.js';
import { KopiArray } from '../../../modules/terminals/classes/index.js';
import { Deferred } from '../../../modules/utils.js';
declare class KopiSubject extends KopiValue {
    static emptyValue: () => KopiArray;
    promise: Deferred;
    constructor(value: KopiValue);
    set(value: KopiValue): this;
    [Symbol.asyncIterator](): AsyncGenerator<Deferred, void, unknown>;
}
export default KopiSubject;
