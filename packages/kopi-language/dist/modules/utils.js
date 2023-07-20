const spaces = (level) => {
    return '  '.repeat(level);
};
const inspect = (value, level = 0) => {
    if (Array.isArray(value)) {
        const props = value.map((value) => `${spaces(level + 1)}${inspect(value, level + 1)}`);
        return value.length === 0
            ? `[]`
            : `[\n${props.join(',\n')}\n${spaces(level)}]`;
    }
    else if (typeof value === 'object') {
        const props = Object.entries(value !== null && value !== void 0 ? value : {}).map(([name, value]) => `${spaces(level + 1)}${name}: ${inspect(value, level + 1)}`);
        return props.length === 0
            ? '{}'
            : `${value === null || value === void 0 ? void 0 : value.constructor.name} {\n${props.join(',\n')}\n${spaces(level)}}`;
    }
    else if (typeof value === 'string') {
        return `"${value}"`;
    }
    else if (typeof value === 'symbol') {
        return `Symbol(${value.description})`;
    }
    return `${value}`;
};
class Deferred {
    constructor() {
        const promise = new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject, Math.pow(2, 32) / 2 - 1);
            this.resolve = (value) => {
                clearTimeout(timeoutId);
                resolve(value);
            };
            this.reject = reject;
        });
        promise.resolve = this.resolve;
        promise.reject = this.reject;
        return promise;
    }
}
export { inspect, Deferred, };
