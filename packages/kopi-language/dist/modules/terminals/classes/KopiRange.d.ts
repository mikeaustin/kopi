import { KopiValue, Context } from '../../shared.js';
import { KopiArray, KopiBoolean, KopiNumber } from './index.js';
declare class KopiRange extends KopiValue {
    static emptyValue: () => KopiArray;
    from: KopiValue;
    to: KopiValue;
    stride: KopiNumber;
    constructor(from: KopiValue, to: KopiValue, stride?: KopiNumber);
    toString(): Promise<string>;
    inspect(): Promise<string>;
    '=='(that: KopiRange, context: Context): Promise<KopiBoolean>;
    apply(thisArg: KopiValue, [by]: [KopiNumber]): Promise<KopiRange>;
    iterator(): Generator<KopiValue, void, unknown>;
    [Symbol.asyncIterator](): AsyncGenerator<KopiValue, void, unknown>;
}
export default KopiRange;
