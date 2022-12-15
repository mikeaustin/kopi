var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inspect } from './utils.js';
class KopiTrait {
}
class KopiNumeric extends KopiTrait {
}
class KopiEquatable extends KopiTrait {
}
class KopiApplicative extends KopiTrait {
}
class KopiEnumerable extends KopiTrait {
}
class KopiBounded extends KopiTrait {
}
class KopiCollection extends KopiTrait {
    static emptyValue() { return new KopiValue(); }
    ;
}
// const $Comparable = ({
//   compare,
//   '<': lessThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) < 0,
//   '>': greaterThan = (thisArg: KopiValue, that: KopiValue) => compare(thisArg, that) > 0,
// }: {
//   compare: (thisArg: KopiValue, that: KopiValue) => number,
//   '<'?: (thisArg: KopiValue, that: KopiValue) => boolean,
//   '>'?: (thisArg: KopiValue, that: KopiValue) => boolean,
// }) => class extends Comparable {
//     // compare(thisArg: KopiValue, that: KopiValue): number { return compare(thisArg, that); }
//     'compare' = compare;
//     '<' = lessThan;
//     '>' = greaterThan;
//   };
const addTraits = (traits, _constructor) => {
    for (const trait of traits) {
        for (const name of Object.getOwnPropertyNames(trait.prototype)) {
            if (!(name in _constructor.prototype) && name !== 'constructor') {
                _constructor.prototype[name] = trait.prototype[name];
            }
        }
        _constructor.traits = traits;
    }
};
//
class KopiValue {
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return inspect(this);
        });
    }
    get fields() {
        return [Promise.resolve(this)];
    }
    toJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    invoke(methodName, [argument, context]) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment } = context;
            const functions = environment._extensions.map.get(this.constructor);
            const method = functions && functions[methodName]
                ? functions[methodName]
                : this[methodName];
            if (method) {
                return yield method.apply(this, [argument, context]);
            }
            throw new Error(`No method '${methodName}' found in ${yield this.inspect()}`);
        });
    }
}
KopiValue.traits = [];
class ASTNode extends KopiValue {
    constructor(location) {
        super();
        this.location = {};
        // this.location = location;
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return inspect(this);
        });
    }
}
class ASTPatternNode extends ASTNode {
}
class Extensions extends KopiValue {
    constructor(mappings) {
        super();
        this.map = new Map(mappings);
    }
}
export { ASTNode, ASTPatternNode, KopiTrait, KopiNumeric, KopiEquatable, KopiApplicative, KopiEnumerable, KopiCollection, KopiValue, Extensions, addTraits, };
