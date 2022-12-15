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
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
import { KopiCollection, KopiTrait } from '../../shared.js';
import { KopiBoolean, KopiNumber, KopiTuple, KopiArray, KopiStream, KopiDict } from '../../terminals/classes/index.js';
class KopiIterable extends KopiTrait {
    toArray() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [];
            const iter = this[Symbol.asyncIterator]();
            let result = iter.next();
            while (!(yield result).done) {
                values.push((yield result).value);
                result = iter.next();
            }
            return new KopiArray(values);
        });
    }
    toDict() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const values = [];
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const tuple = _c.value;
                    const fields = tuple.fields;
                    if (fields[0] && fields[1]) {
                        values.push([yield fields[0], fields[1]]);
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
            return new KopiDict(values);
        });
    }
    //
    reduce(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let accum = Promise.resolve(KopiTuple.empty);
            const iter = this[Symbol.asyncIterator]();
            let result = iter.next();
            while (!(yield result).done) {
                accum = func.apply(KopiTuple.empty, [new KopiTuple([accum, (yield result).value]), context]);
                result = iter.next();
            }
            return accum;
        });
    }
    scan(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let accum = Promise.resolve(KopiTuple.empty);
            const iter = this[Symbol.asyncIterator]();
            let result = iter.next();
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    while (!(yield __await(result)).done) {
                        yield yield __await(accum = func.apply(KopiTuple.empty, [new KopiTuple([accum, (yield __await(result)).value]), context]));
                        result = iter.next();
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    each(func, context) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const value = _c.value;
                    func.apply(KopiTuple.empty, [value, context]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return KopiTuple.empty;
        });
    }
    map(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    var e_3, _a;
                    try {
                        for (var _b = __asyncValues(this), _c; _c = yield __await(_b.next()), !_c.done;) {
                            const value = _c.value;
                            yield yield __await(func.apply(KopiTuple.empty, [value, context]));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    // async map2(func: KopiFunction, context: Context): Promise<InstanceType<ReturnType<typeof KopiStream2>>> {
    //   const generator = async function* (this: KopiIterable) {
    //     for await (const value of this) {
    //       yield func.apply(KopiTuple.empty, [value, context]);
    //     }
    //   }.apply(this);
    //   return new (KopiStream2(KopiIterable.emptyValue() as unknown as KopiCollection))(generator);
    // }
    flatMap(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    var e_4, _a;
                    try {
                        for (var _b = __asyncValues(this), _c; _c = yield __await(_b.next()), !_c.done;) {
                            const value = _c.value;
                            const mappedValue = yield __await(func.apply(KopiTuple.empty, [value, context]));
                            if (Symbol.asyncIterator in mappedValue) {
                                yield __await(yield* __asyncDelegator(__asyncValues(mappedValue)));
                            }
                            else {
                                yield yield __await(mappedValue);
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    filter(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    var e_5, _a;
                    try {
                        for (var _b = __asyncValues(this), _c; _c = yield __await(_b.next()), !_c.done;) {
                            const value = _c.value;
                            if ((yield __await(func.apply(KopiTuple.empty, [value, context]))).value) {
                                yield yield __await(value);
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    //
    find(func, context) {
        var e_6, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const value = _c.value;
                    if ((yield func.apply(KopiTuple.empty, [value, context])).value) {
                        return value;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return KopiTuple.empty;
        });
    }
    includes(value, context) {
        var e_7, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const _value = _c.value;
                    if (value['=='].apply(value, [yield _value, context]).value) {
                        return new KopiBoolean(true);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return new KopiBoolean(false);
        });
    }
    count(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var count = 0;
            const iter = this[Symbol.asyncIterator]();
            let result = iter.next();
            while (!(yield result).done) {
                if ((yield func.apply(KopiTuple.empty, [(yield result).value, context])).value) {
                    count += 1;
                }
                result = iter.next();
            }
            return new KopiNumber(count);
        });
    }
    take(count) {
        let index = 0;
        const generator = function () {
            return __asyncGenerator(this, arguments, function* () {
                var e_8, _a;
                try {
                    for (var _b = __asyncValues(this), _c; _c = yield __await(_b.next()), !_c.done;) {
                        const value = _c.value;
                        if (index++ < count.value) {
                            yield yield __await(value);
                        }
                        else {
                            break;
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            });
        }.apply(this);
        return new KopiStream(generator);
    }
    skip(count) {
        let index = 0;
        const generator = function () {
            return __asyncGenerator(this, arguments, function* () {
                var e_9, _a;
                try {
                    for (var _b = __asyncValues(this), _c; _c = yield __await(_b.next()), !_c.done;) {
                        const value = _c.value;
                        if (!(index++ < count.value)) {
                            yield yield __await(value);
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            });
        }.apply(this);
        return new KopiStream(generator);
    }
    some(func, context) {
        var e_10, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const value = _c.value;
                    if ((yield func.apply(KopiTuple.empty, [value, context])).value) {
                        return new KopiBoolean(true);
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return new KopiBoolean(false);
        });
    }
    every(func, context) {
        var e_11, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const value = _c.value;
                    if (!(yield func.apply(KopiTuple.empty, [value, context])).value) {
                        return new KopiBoolean(false);
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return new KopiBoolean(true);
        });
    }
    cycle() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = yield this.toArray();
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    var e_12, _a;
                    while (true) {
                        try {
                            for (var values_1 = (e_12 = void 0, __asyncValues(values)), values_1_1; values_1_1 = yield __await(values_1.next()), !values_1_1.done;) {
                                const value = values_1_1.value;
                                yield yield __await(value);
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) yield __await(_a.call(values_1));
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    splitOn(splitter, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructorTraits = this.constructor.traits;
            if (!constructorTraits.includes(KopiCollection)) {
                throw new Error(`KopiIterable.splitOn(): 'this' value '${yield this.inspect()}' of type '${this.constructor.name}' does not conform to trait 'KopiCollection'\n  Trait 'KopiCollection' implements methods 'static emptyValue()' and 'append()'`);
            }
            let values = this.constructor.emptyValue();
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    const iter = this[Symbol.asyncIterator]();
                    let result = iter.next();
                    while (!(yield __await(result)).done) {
                        if ((yield __await((yield __await((yield __await(result)).value)).invoke('==', [splitter, context]))).value) {
                            yield yield __await(values);
                            values = this.constructor.emptyValue();
                        }
                        else {
                            values = yield __await(values.append((yield __await(result)).value));
                        }
                        result = iter.next();
                    }
                    yield yield __await(values);
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    splitOnLimit(splitter, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return (limit) => __awaiter(this, void 0, void 0, function* () {
                const constructorTraits = this.constructor.traits;
                if (!constructorTraits.includes(KopiCollection)) {
                    throw new Error(`KopiIterable.splitOn(): 'this' value '${yield this.inspect()}' of type '${this.constructor.name}' does not conform to trait 'KopiCollection'\n  Trait 'KopiCollection' implements methods 'static emptyValue()' and 'append()'`);
                }
                let values = this.constructor.emptyValue();
                const generator = function () {
                    return __asyncGenerator(this, arguments, function* () {
                        const iter = this[Symbol.asyncIterator]();
                        let result = iter.next();
                        let count = 0;
                        while (count < limit.value && !(yield __await(result)).done) {
                            if ((yield __await((yield __await((yield __await(result)).value)).invoke('==', [splitter, context]))).value) {
                                yield yield __await(values);
                                values = this.constructor.emptyValue();
                                ++count;
                            }
                            else {
                                values = yield __await(values.append((yield __await(result)).value));
                            }
                            result = iter.next();
                        }
                        while (!(yield __await(result)).done) {
                            values = yield __await(values.append((yield __await(result)).value));
                            result = iter.next();
                        }
                        yield yield __await(values);
                    });
                }.apply(this);
                return new KopiStream(generator);
            });
        });
    }
    splitEvery(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructorTraits = this.constructor.traits;
            if (!constructorTraits.includes(KopiCollection)) {
                throw new Error(`KopiIterable.splitEvery(): 'this' value '${yield this.inspect()}' of type '${this.constructor.name}' does not conform to trait 'KopiCollection'\n  Trait 'KopiCollection' implements methods 'static emptyValue()' and 'append()'`);
            }
            let values = this.constructor.emptyValue();
            let index = 0;
            let length = 0;
            const generator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    const iter = this[Symbol.asyncIterator]();
                    let result = iter.next();
                    while (!(yield __await(result)).done) {
                        if (length > 0 && index % count.value === 0) {
                            yield yield __await(values);
                            values = this.constructor.emptyValue();
                            length = 0;
                        }
                        values = yield __await(values.append((yield __await(result)).value));
                        ++index;
                        ++length;
                        result = iter.next();
                    }
                    if (length !== 0) {
                        yield yield __await(values);
                    }
                });
            }.apply(this);
            return new KopiStream(generator);
        });
    }
    sum() {
        var e_13, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let total = 0;
            try {
                for (var _b = __asyncValues(this), _c; _c = yield _b.next(), !_c.done;) {
                    const value = _c.value;
                    total += value.value;
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_13) throw e_13.error; }
            }
            return new KopiNumber(total);
        });
    }
}
export default KopiIterable;
