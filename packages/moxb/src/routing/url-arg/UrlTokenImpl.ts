import { computed, makeObservable } from 'mobx';
import { MyLocation, locationToUrl, SuccessCallback, UpdateMethod } from '../location-manager';
import { TokenManager } from '../TokenManager';
import { Query } from '../url-schema/UrlSchema';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { existsInQuery, getFromQuery } from './UrlArgImpl';
import { TestLocation } from '../location-manager/LocationManager';

/**
 * Implement an Url Arg on top of URL tokens
 */
export class UrlTokenImpl<T> implements UrlArg<T> {
    private readonly _def: UrlArgDefinition<T>;
    private readonly _parser: ParserFunc<T>;
    public readonly key: string;
    public readonly defaultValue: T;

    public constructor(private readonly _tokenManager: TokenManager, definition: UrlArgDefinition<T>) {
        makeObservable<UrlTokenImpl<any>, '_currentQuery'>(this, {
            _currentQuery: computed,
            defined: computed,
            value: computed,
            rawValue: computed,
        });

        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        this.key = this._def.key;
        this.defaultValue = this._def.defaultValue;
    }

    private get _currentQuery() {
        return this._tokenManager.tokens;
    }

    public get defined() {
        return existsInQuery(this._currentQuery, this.key);
    }

    // Extract the value from a given query
    getOnQuery(query: Query) {
        const { defaultValue } = this._def;
        return getFromQuery(query, this.key, this._parser, defaultValue);
    }

    public get value() {
        return this.getOnQuery(this._currentQuery);
    }

    valueOn(location: TestLocation) {
        return this.getOnQuery(location.query);
    }

    public getRawValue(value: T) {
        const {
            valueType: { format },
        } = this._def;
        return format(value);
    }

    public getModifiedLocation(startLocation: MyLocation, value: T) {
        const rawValue = this.getRawValue(value);
        return this._tokenManager.getLocationForTokenChange(startLocation, this.key, rawValue);
    }

    public getResetLocation(startLocation: MyLocation) {
        return this.getModifiedLocation(startLocation, this._def.defaultValue);
    }

    public getModifiedUrl(value: T) {
        return locationToUrl(this.getModifiedLocation(this._tokenManager.getCurrentLocation(), value));
    }

    public getResetUrl() {
        return this.getModifiedUrl(this._def.defaultValue);
    }

    public doSet(value: T, method?: UpdateMethod) {
        const rawValue = this.getRawValue(value);
        this._tokenManager.doSetToken(this.key, rawValue, method);
    }

    public doReset(method?: UpdateMethod) {
        this.doSet(this._def.defaultValue, method);
    }

    public trySet(value: T, method?: UpdateMethod, callback?: SuccessCallback) {
        const rawValue = this.getRawValue(value);
        this._tokenManager.trySetToken(this.key, rawValue, method, callback);
    }

    public tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }

    public get rawValue() {
        return this._currentQuery[this.key];
    }
}
