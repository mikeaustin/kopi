import { KopiValue, Context } from '../../../modules/shared.js';
import { KopiFunction } from '../../../modules/terminals/classes/index.js';
import { Deferred } from '../../utils.js';
declare class KopiCoroutine extends KopiValue {
    deferred: Deferred[];
    constructor();
    yield(func: KopiFunction, context: Context): Promise<void>;
    send(value: KopiValue): Promise<Deferred | undefined>;
}
export default KopiCoroutine;
