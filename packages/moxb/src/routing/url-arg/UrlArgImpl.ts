import { computed } from 'mobx';
import { MyLocation, LocationManager, SuccessCallback, UpdateMethod } from '../location-manager';

import { Query } from '../url-schema/UrlSchema';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { TestLocation } from '../location-manager/LocationManager';

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
    public readonly key: string;
    public readonly defaultValue: T;

    public constructor(private readonly _locationManager: LocationManager, definition: UrlArgDefinition<T>) {
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        if (this._def.permanent) {
            this._locationManager.registerUrlArg(this);
        }
        this.key = this._def.key;
        this.defaultValue = this._def.defaultValue;
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

    public valueOn(location: TestLocation) {
        return this.getOnQuery(location.query);
    }

    private _getRawValue(value: T) {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue) ? undefined : format(value);
    }

    public getModifiedUrl(value: T) {
        const rawValue = this._getRawValue(value);
        return this._locationManager.getURLForQueryChange(this.key, rawValue);
    }

    public getModifiedLocation(start: MyLocation, value: T) {
        const rawValue = this._getRawValue(value);
        return this._locationManager.getNewLocationForQueryChanges(start, [{ key: this.key, value: rawValue }]);
    }

    public getResetUrl() {
        return this.getModifiedUrl(this._def.defaultValue);
    }

    public getResetLocation(start: MyLocation): MyLocation {
        return this.getModifiedLocation(start, this._def.defaultValue);
    }

    public doSet(value: T, method?: UpdateMethod) {
        const rawValue = this._getRawValue(value);
        this._locationManager.doSetQuery(this.key, rawValue, method);
    }

    public trySet(value: T, method?: UpdateMethod, callback?: SuccessCallback) {
        const rawValue = this._getRawValue(value);
        this._locationManager.trySetQuery(this.key, rawValue, method, callback);
    }

    public doReset(method?: UpdateMethod) {
        this.doSet(this._def.defaultValue, method);
    }

    public tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }
}
