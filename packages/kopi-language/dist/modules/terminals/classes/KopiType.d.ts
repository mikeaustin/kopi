import { KopiValue, Context } from '../../shared.js';
import { KopiApplicative } from '../../shared.js';
declare class KopiType extends KopiValue {
    static readonly traits: (typeof KopiApplicative)[];
    readonly _constructor: any;
    constructor(_constructor: Function);
    inspect(): Promise<any>;
    apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue>;
}
export default KopiType;
