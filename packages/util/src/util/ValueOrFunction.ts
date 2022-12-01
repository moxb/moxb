export type ValueOrFunction<T> = T | (() => T | undefined) | undefined;

export function getValueOrFunction<T>(value: ValueOrFunction<T>): T | undefined {
    if (typeof value === 'function') {
        return (value as any)();
    } else {
        return value;
    }
}

export type StringOrFunction = ValueOrFunction<string>;

export function getValueFromStringOrFunction(value: StringOrFunction): string | undefined {
    return getValueOrFunction(value);
}
