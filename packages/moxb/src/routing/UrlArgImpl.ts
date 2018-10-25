import { computed } from 'mobx';

import { Query } from './UrlSchema';
import { LocationManager, UpdateMethod } from './LocationManager';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';

function existsInQuery(query: Query, key: string) {
    return query[key] !== undefined;
}

function getFromQuery<T>(query: Query, key: string, parse: ParserFunc<T>, defaultValue: T) {
    const formatted: string = query[key];
    const result: T = formatted === undefined ? defaultValue : parse(formatted, defaultValue);
    return result;
}

export class UrlArgImpl<T> implements UrlArg<T> {
    private _def: UrlArgDefinition<T>;
    private _parser: ParserFunc<T>;
    public readonly key: string;

    public constructor(private readonly _locationManager: LocationManager, definition: UrlArgDefinition<T>) {
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        if (this._def.permanent) {
            this._locationManager.registerUrlArg(this);
        }
        this.key = this._def.key;
    }

    @computed
    public get defined() {
        return existsInQuery(this._locationManager.query, this.key);
    }

    // Extract the value from a given query
    public getOnQuery(query: Query) {
        const { defaultValue } = this._def;
        return getFromQuery(query, this.key, this._parser, defaultValue);
    }

    @computed
    public get value() {
        return this.getOnQuery(this._locationManager.query);
    }

    public getRawValue(value: T) {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue) ? undefined : format(value);
    }

    public getModifiedUrl(value: T) {
        const rawValue = this.getRawValue(value);
        return this._locationManager.getURLForQueryChange(this.key, rawValue);
    }

    public set(value: T, method?: UpdateMethod) {
        const rawValue = this.getRawValue(value);
        this._locationManager.setQuery(this.key, rawValue, method);
    }

    public set value(value: T) {
        this.set(value);
    }

    public reset(method?: UpdateMethod) {
        this.set(this._def.defaultValue, method);
    }

    @computed
    public get rawValue() {
        return this._locationManager.query[this.key];
    }
}
