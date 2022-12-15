import { KopiValue, Context, BindValues } from '../../../modules/shared.js';
declare class KopiContext extends KopiValue {
    constructor(value: KopiValue, bindValues: BindValues);
    set(value: KopiValue, context: Context): void;
    get(value: KopiValue, context: Context): KopiValue | undefined;
    symbol: symbol;
    value: KopiValue;
}
export default KopiContext;
