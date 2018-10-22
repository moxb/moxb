import memoize = require('lodash.memoize');
import { UrlArgTypeDef } from './UrlArg';
import { Path } from 'history';

export const URLARG_TYPE_STRING: UrlArgTypeDef<string> = {
    getParser: () => v => v,
    isEqual: (v1, v2) => v1 === v2,
    format: v => v,
};

export const URLARG_TYPE_PATH: UrlArgTypeDef<Path> = {
    getParser: () => v => v,
    isEqual: (v1, v2) => v1 === v2,
    format: v => v,
};

export const URLARG_TYPE_BOOLEAN: UrlArgTypeDef<boolean> = {
    getParser: () => memoize((v: string) => v === 'true'),
    isEqual: (v1, v2) => !!v1 === !!v2,
    format: v => v.toString(),
};

const empty: string[] = [];

const createStringArrayParser = (_key: string) => {
    const parser = memoize(
        (v: string, _defaultValue: any): string[] => {
            const result = v.length ? v.split(',').slice() : empty;
            return result;
        },
        v => v.toString()
    );
    return parser;
};

export const URLARG_TYPE_ORDERED_STRING_ARRAY: UrlArgTypeDef<string[]> = {
    getParser: memoize(key => createStringArrayParser(key)),
    isEqual: (v1, v2) => v1.slice().join(',') === v2.slice().join(','),
    format: v => v.join(','),
};

export const URLARG_TYPE_UNORDERED_STRING_ARRAY: UrlArgTypeDef<string[]> = {
    getParser: memoize(key => createStringArrayParser(key)),
    isEqual: (v1, v2) =>
        v1
            .slice()
            .sort()
            .join(',') ===
        v2
            .slice()
            .sort()
            .join(','),
    format: v => v.join(','),
};

export function URLARG_TYPE_OBJECT<T>(): UrlArgTypeDef<T> {
    const parser = (v: string, defaultValue: T): T => {
        if (!v.length) {
            return (null as any) as T;
        }
        try {
            return JSON.parse(atob(v));
        } catch (e) {
            console.log("Warning: Can't decode base64 encoded structure.");
            return defaultValue;
        }
    };

    return {
        getParser: () => memoize(parser),
        isEqual: (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2),
        format: v => btoa(JSON.stringify(v)),
    };
}

export const URLARG_TYPE_URLENCODED: UrlArgTypeDef<string> = {
    format: encodeURIComponent,
    getParser: () => memoize(decodeURIComponent),
    isEqual: (v1, v2) => v1 === v2,
};
