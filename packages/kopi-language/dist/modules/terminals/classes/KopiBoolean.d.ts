import { KopiValue } from '../../shared.js';
declare class KopiBoolean extends KopiValue {
    readonly value: boolean;
    constructor(value: boolean);
    toString(): Promise<"true" | "false">;
    inspect(): Promise<"true" | "false">;
    '!'(): KopiBoolean;
    '=='(that: KopiBoolean): KopiBoolean;
}
export default KopiBoolean;
