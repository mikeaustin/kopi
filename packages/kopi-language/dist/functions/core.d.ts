import { Context, KopiValue } from '../modules/shared.js';
import { KopiContext, KopiCoroutine, KopiElement, KopiEnum, KopiFunction, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes/index.js';
declare class KopiLoop extends KopiValue {
    constructor(value: KopiValue);
    value: KopiValue;
}
declare function kopi_print(value: KopiValue): Promise<KopiTuple>;
declare function kopi_match(value: KopiValue, context: Context): (tuple: KopiTuple) => Promise<KopiValue>;
declare function kopi_sleep(number: KopiNumber): Promise<unknown>;
declare function kopi_let(func: KopiFunction, context: Context): Promise<KopiValue>;
declare function kopi_loop(value: KopiValue): Promise<KopiLoop>;
declare function kopi_type(type: KopiTuple): Promise<{
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    apply(thisArg: KopiValue, [tuple, context]: [KopiTuple, Context]): Promise<KopiValue>;
}>;
declare function kopi_enum(tuple: KopiTuple): Promise<KopiEnum>;
declare function kopi_extend(type: Function, context: Context): Promise<(methods: KopiTuple) => Promise<void>>;
declare function kopi_iterate(value: KopiValue, context: Context): Promise<(func: KopiFunction) => KopiStream>;
declare function kopi_fetch(url: KopiString): Promise<KopiString>;
declare function kopi_context(value: KopiValue, context: Context): Promise<KopiContext>;
declare function kopi_spawn(func: KopiFunction, context: Context): Promise<KopiCoroutine>;
declare function kopi_image(url: KopiString): Promise<KopiElement>;
export { kopi_print, kopi_match, kopi_sleep, kopi_let, kopi_loop, kopi_type, kopi_enum, kopi_extend, kopi_iterate, kopi_fetch, kopi_context, kopi_spawn, kopi_image, };
