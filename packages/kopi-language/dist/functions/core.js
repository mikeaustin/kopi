var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import React from 'react';
import { Extensions, KopiValue } from '../modules/shared.js';
import { KopiContext, KopiCoroutine, KopiElement, KopiEnum, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes/index.js';
class KopiLoop extends KopiValue {
    constructor(value) {
        super();
        this.value = value;
    }
}
//
function kopi_print(value) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield value.toString());
        return KopiTuple.empty;
    });
}
function kopi_match(value, context) {
    return (tuple) => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(tuple.fields), _c; _c = yield _b.next(), !_c.done;) {
                const func = _c.value;
                const matches = yield func.parameterPattern.match(value, context);
                if (matches) {
                    return func.apply(KopiTuple.empty, [value, context]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        throw new Error('Match failed');
    });
}
function kopi_sleep(number) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => resolve(number), number.value * 1000);
        });
    });
}
function kopi_let(func, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = KopiTuple.empty;
        do {
            const result2 = result instanceof KopiLoop ? result.value : result;
            result = yield func.apply(KopiTuple.empty, [result2, context]);
        } while (result instanceof KopiLoop);
        return result instanceof KopiLoop ? result.value : result;
    });
}
function kopi_loop(value) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiLoop(value);
    });
}
function kopi_type(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const _constructor = class extends type.constructor {
            static apply(thisArg, [tuple, context]) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new _constructor(tuple._fields, tuple.fieldNames);
                });
            }
        };
        Object.defineProperty(_constructor, 'name', { value: 'Custom' });
        return _constructor;
    });
}
function kopi_enum(tuple) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiEnum(yield Promise.all(tuple.fields), tuple.fieldNames);
    });
}
function kopi_extend(type, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensions = context.environment._extensions;
        return (methods) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const newMethods = yield methods.fields.reduce((newMethods, method, index) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                return (Object.assign(Object.assign({}, yield newMethods), { [(_b = methods.fieldNames[index]) !== null && _b !== void 0 ? _b : 'invalid']: yield method }));
            }), (_a = extensions.map.get(type)) !== null && _a !== void 0 ? _a : {});
            context.bindValues({
                _extensions: new Extensions([...extensions.map, [type, newMethods]])
            });
        });
    });
}
function kopi_iterate(value, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return function (func) {
            let result = value;
            const generator = (function () {
                return __asyncGenerator(this, arguments, function* () {
                    for (;;) {
                        yield yield __await(result = yield __await(func.apply(KopiTuple.empty, [result, context])));
                    }
                });
            })();
            return new KopiStream(generator);
        };
    });
}
function kopi_fetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fetch(url.value);
        return new KopiString(yield (yield data).text());
    });
}
function kopi_context(value, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { bindValues } = context;
        return new KopiContext(value, bindValues);
    });
}
function kopi_spawn(func, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const coroutine = new KopiCoroutine();
        func.apply(KopiTuple.empty, [coroutine.yield.bind(coroutine), context]);
        return coroutine;
    });
}
function kopi_image(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiElement(React.createElement('img', { src: url.value }));
    });
}
export { kopi_print, kopi_match, kopi_sleep, kopi_let, kopi_loop, kopi_type, kopi_enum, kopi_extend, kopi_iterate, kopi_fetch, kopi_context, kopi_spawn, kopi_image, };
