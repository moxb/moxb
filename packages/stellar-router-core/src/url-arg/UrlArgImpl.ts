import { computed, makeObservable } from 'mobx';
import { MyLocation, LocationManager, SuccessCallback, UpdateMethod } from '../location-manager';

import { Query } from '../url-schema/UrlSchema';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { TestLocation } from '../location-manager/TestLocation';

export function existsInQuery(query: Query, key: string) {
    return query[key] !== undefined;
}

export function getFromQuery<T>(query: Query, key: string, parse: ParserFunc<T>, defaultValue: T) {
    const formatted: string = query[key];
    return formatted === undefined ? defaultValue : parse(formatted);
}

export class UrlArgImpl<T> implements UrlArg<T> {
    private readonly _def: UrlArgDefinition<T>;
    private readonly _parser: ParserFunc<T>;
    readonly key: string;
    readonly _defaultValue: T;

    constructor(private readonly _locationManager: LocationManager, definition: UrlArgDefinition<T>) {
        makeObservable(this);
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        if (this._def.permanent) {
            this._locationManager._registerUrlArg(this);
        }
        this.key = this._def.key;
        this._defaultValue = this._def.defaultValue;
    }

    @computed
    get _defined() {
        return existsInQuery(this._locationManager._query, this.key);
    }

    // Extract the value from a given query
    getOnQuery(query: Query) {
        const { defaultValue } = this._def;
        return getFromQuery(query, this.key, this._parser, defaultValue);
    }

    @computed
    get value() {
        return this.getOnQuery(this._locationManager._query);
    }

    _valueOn(location: TestLocation) {
        return this.getOnQuery(location.query);
    }

    private _getRawValue(value: T) {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue) ? undefined : format(value);
    }

    _getModifiedUrl(value: T) {
        const rawValue = this._getRawValue(value);
        return this._locationManager._getURLForQueryChange(this.key, rawValue);
    }

    _getModifiedLocation(start: MyLocation, value: T) {
        const rawValue = this._getRawValue(value);
        return this._locationManager._getNewLocationForQueryChanges(start, [{ key: this.key, value: rawValue }]);
    }

    _getResetUrl() {
        return this._getModifiedUrl(this._def.defaultValue);
    }

    _getResetLocation(start: MyLocation): MyLocation {
        return this._getModifiedLocation(start, this._def.defaultValue);
    }

    doSet(value: T, method?: UpdateMethod) {
        const rawValue = this._getRawValue(value);
        this._locationManager._doSetQuery(this.key, rawValue, method);
    }

    trySet(value: T, method?: UpdateMethod, callback?: SuccessCallback) {
        const rawValue = this._getRawValue(value);
        this._locationManager._trySetQuery(this.key, rawValue, method, callback);
    }

    doReset(method?: UpdateMethod) {
        this.doSet(this._def.defaultValue, method);
    }

    tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }
}
