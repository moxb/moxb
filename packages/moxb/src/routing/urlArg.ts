import { computed } from 'mobx';
import memoize = require('lodash.memoize');
const MyURI = require('urijs');
import { Path } from 'history';

import { Query, LocationManager } from './LocationManager';

interface ParserFunc<T> {
    (formatted: string, defaultValue: T): T;
}

interface EqualityTester<T> {
    (v1: T, v2: T): boolean;
}

interface FormatterFunc<T> {
    (value: T): string;
}

export interface UrlArgTypeDef<T> {
    getParser: (key: string) => ParserFunc<T>;
    isEqual: EqualityTester<T>;
    format: FormatterFunc<T>;
}

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

export type UrlArgUpdateMethod = 'push' | 'replace';

export interface UrlArgDefinition<T> {
    key: string;
    valueType: UrlArgTypeDef<T>;
    parser?: ParserFunc<T>;
    defaultValue: T;
    //    updateMethod?: UrlArgUpdateMethod;
}

function existsInQuery(query: Query, key: string) {
    return query[key] !== undefined;
}

function getFromQuery<T>(query: Query, key: string, parse: ParserFunc<T>, defaultValue: T) {
    const formatted: string = query[key];
    const result: T = formatted === undefined ? defaultValue : parse(formatted, defaultValue);
    return result;
}

export class UrlArg<T> {
    private _def: UrlArgDefinition<T>;
    //    private _locationManager: LocationManager;
    private _parser: ParserFunc<T>;

    public constructor(private readonly _locationManager: LocationManager, definition: UrlArgDefinition<T>) {
        const { parser, valueType, key } = (this._def = definition);
        //        this._locationManager = location;
        this._parser = parser || valueType.getParser(key);
    }

    @computed
    public get defined() {
        const { key } = this._def;
        //        console.log("Testing for arg", key);
        return existsInQuery(this._locationManager.query, key);
    }

    // Extract the value from a given query
    public getOnQuery(query: Query) {
        const { key, defaultValue } = this._def;
        return getFromQuery(query, key, this._parser, defaultValue);
    }

    @computed
    public get value() {
        return this.getOnQuery(this._locationManager.query);
    }

    public wouldModifyLocation(value: T) {
        const {
            key,
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;

        const oldLocation = this._locationManager.location;
        const oldSearchString = oldLocation.search;
        const url = new MyURI().search(oldSearchString);
        const query = url.search(true);
        //        console.log("Old query is", query);
        if (isEqual(value, defaultValue)) {
            //            console.log("Dropping default");
            delete query[key];
        } else {
            query[key] = format(value);
        }
        //        console.log("New query is", query);
        const newSearchString = url
            .search(query)
            .search()
            .replace(/%2C/g, ',')
            .replace(/%40/g, '@');
        return newSearchString !== oldSearchString;
    }

    public getModifiedLocation(value: T) {
        const {
            key,
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;

        const oldLocation = this._locationManager.location;
        const oldSearchString = oldLocation.search;
        const url = new MyURI().search(oldSearchString);
        const query = url.search(true);
        //        console.log("Old query is", query);
        if (isEqual(value, defaultValue)) {
            //            console.log("Dropping default");
            delete query[key];
        } else {
            query[key] = format(value);
        }
        //        console.log("New query is", query);
        const newSearchString = url
            .search(query)
            .search()
            .replace(/%2C/g, ',')
            .replace(/%40/g, '@');
        const newLocation = {
            ...oldLocation,
            search: newSearchString,
        };
        return newLocation;
    }

    public getModifiedUrl(value: T) {
        const location = this.getModifiedLocation(value);
        const url = new MyURI()
            .path(location.pathname)
            .search(location.search)
            .hash((location as any).hash);
        return url.toString();
    }

    public set(value: T, method?: UrlArgUpdateMethod) {
        if (this.wouldModifyLocation(value)) {
            const newLocation = this.getModifiedLocation(value);
            const effectiveMethod = method || 'push';
            if (effectiveMethod === 'push') {
                this._locationManager.pushLocation(newLocation);
            } else {
                this._locationManager.replaceLocation(newLocation);
            }
        }
    }

    public set value(value: T) {
        this.set(value);
    }

    public reset(method?: UrlArgUpdateMethod) {
        this.set(this._def.defaultValue, method);
    }
}
