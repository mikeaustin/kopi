/* eslint-disable no-extend-native */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as parser from './lib/parser.js';
import { KopiApplicative } from './modules/shared.js';
import * as operators from './modules/operators/index.js';
import * as terminals from './modules/terminals/index.js';
import { KopiValue, Extensions } from './modules/shared.js';
import { KopiElement, KopiNumber, KopiString, KopiTuple, KopiSubject, KopiTimer } from './modules/terminals/classes/index.js';
import * as core from './functions/core.js';
import React from 'react';
class KopiChart extends KopiElement {
    constructor(data) {
        super(React.createElement('svg', { height: 100 }, [
            React.createElement('circle', { cx: 50, cy: 50, r: 50 })
        ]));
        this.data = data;
    }
    // @ts-ignore
    static inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `Chart`;
        });
    }
    // @ts-ignore
    static apply(thisArg, data) {
        console.log('here');
        return new KopiChart(data);
    }
}
Function.prototype.inspect = function () {
    return Promise.resolve(`<native-function>`);
};
Function.traits = [KopiApplicative];
//
const environment = {
    x: new KopiNumber(3),
    String: KopiString,
    Number: KopiNumber,
    Chart: KopiChart,
    Observer(value) {
        return new KopiSubject(value);
    },
    // print: core.kopi_print,
    sleep: core.kopi_sleep,
    match: core.kopi_match,
    let: core.kopi_let,
    loop: core.kopi_loop,
    type: core.kopi_type,
    enum: core.kopi_enum,
    extend: core.kopi_extend,
    fetch: core.kopi_fetch,
    iterate: core.kopi_iterate,
    context: core.kopi_context,
    spawn: core.kopi_spawn,
    image: core.kopi_image,
    timer(msec) {
        return __awaiter(this, void 0, void 0, function* () {
            return new KopiTimer(msec.value);
        });
    },
    _extensions: new Extensions([[KopiString, {
                capitalize: function (tuple) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new KopiString(this.value.toUpperCase());
                    });
                }
            }]])
};
const transformAst = (ast) => {
    return transformAstPipeline(ast);
};
const transformAstPipeline = operators.transformAst(terminals.transformAst(transformAst), transformAst);
const evaluateAst = (ast, environment, bindValues) => {
    return evaluateAstPipeline(ast, environment, bindValues);
};
const evaluateAstPipeline = operators.evaluateAst(terminals.evaluateAst(evaluateAst), evaluateAst);
function interpret(source, kopi_print = core.kopi_print) {
    return __awaiter(this, void 0, void 0, function* () {
        var ast = parser.parse(source);
        return evaluateAst(transformAst(ast), Object.assign(Object.assign({}, environment), { print: kopi_print }), () => { });
    });
}
const parse = (source) => {
    return transformAst(parser.parse(source));
};
export { environment, parse, transformAst, evaluateAst, interpret, KopiValue, KopiTuple, };
