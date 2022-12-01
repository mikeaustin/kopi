import { KopiValue } from '../modules/shared';

const spaces = (level: number) => {
  return '  '.repeat(level);
};

const inspect = (value: unknown, level: number = 0): string => {
  if (Array.isArray(value)) {
    const props = value.map((value) => `${spaces(level + 1)}${inspect(value, level + 1)}`);

    return value.length === 0
      ? `[]`
      : `[\n${props.join(',\n')}\n${spaces(level)}]`;
  }
  else if (typeof value === 'object') {
    const props = Object.entries(value ?? {}).map(
      ([name, value]) => `${spaces(level + 1)}${name}: ${inspect(value, level + 1)}`
    );

    return props.length === 0
      ? '{}'
      : `${value?.constructor.name} {\n${props.join(',\n')}\n${spaces(level)}}`;
  } else if (typeof value === 'string') {
    return `"${value}"`;
  }

  return `${value}`;
};

class Deferred {
  constructor() {
    const promise = new Promise<KopiValue>((resolve, reject) => {
      const timeoutId = setTimeout(() => reject, Math.pow(2, 32) / 2 - 1);

      (this as any).resolve = (value: KopiValue) => {
        clearTimeout(timeoutId);

        resolve(value);
      };

      (this as any).reject = reject;
    });

    (promise as any).resolve = (this as any).resolve;
    (promise as any).reject = (this as any).reject;

    return promise;
  }
}

export {
  inspect,
  Deferred,
};
