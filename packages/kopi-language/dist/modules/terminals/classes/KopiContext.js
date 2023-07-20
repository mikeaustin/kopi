import { KopiValue } from '../../../modules/shared.js';
class KopiContext extends KopiValue {
    constructor(value, bindValues) {
        super();
        this.symbol = Symbol();
        this.value = value;
        bindValues({
            [this.symbol]: value,
        });
    }
    set(value, context) {
        const { bindValues } = context;
        bindValues({
            [this.symbol]: value,
        });
    }
    get(value, context) {
        const { environment } = context;
        return environment[this.symbol];
    }
}
export default KopiContext;
