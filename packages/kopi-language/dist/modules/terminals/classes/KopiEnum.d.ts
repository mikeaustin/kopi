import { KopiValue } from '../../shared.js';
declare class KopiEnum extends KopiValue {
    readonly _fields: KopiValue[];
    readonly fieldNames: (string | null)[];
    constructor(fields: KopiValue[], fieldNames?: (string | null)[]);
    inspect(): Promise<string>;
}
export default KopiEnum;
