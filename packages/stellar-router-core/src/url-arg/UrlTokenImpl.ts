import { computed, makeObservable } from 'mobx';
import { MyLocation, locationToUrl, SuccessCallback, UpdateMethod } from '../location-manager';
import { TokenManager } from '../TokenManager';
import { Query } from '../url-schema/UrlSchema';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { existsInQuery, getFromQuery } from './UrlArgImpl';
import { TestLocation } from '../location-manager/TestLocation';

/**
 * Implement an Url Arg on top of URL tokens
 */
export class UrlTokenImpl<T> implements UrlArg<T> {
    private readonly _def: UrlArgDefinition<T>;
    private readonly _parser: ParserFunc<T>;
    readonly key: string;
    readonly _defaultValue: T;

    constructor(private readonly _tokenManager: TokenManager, definition: UrlArgDefinition<T>) {
        makeObservable(this);
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        this.key = this._def.key;
        this._defaultValue = this._def.defaultValue;
    }

    @computed
    private get _currentQuery() {
        return this._tokenManager.tokens;
    }

    @computed
    get _defined() {
        return existsInQuery(this._currentQuery, this.key);
    }

    // Extract the value from a given query
    getOnQuery(query: Query) {
        const { defaultValue } = this._def;
        return getFromQuery(query, this.key, this._parser, defaultValue);
    }

    @computed
    get value() {
        return this.getOnQuery(this._currentQuery);
    }

    _valueOn(location: TestLocation) {
        return this.getOnQuery(location.query);
    }

    getRawValue(value: T) {
        const {
            valueType: { format },
        } = this._def;
        return format(value);
    }

    _getModifiedLocation(startLocation: MyLocation, value: T) {
        const rawValue = this.getRawValue(value);
        return this._tokenManager.getLocationForTokenChange(startLocation, this.key, rawValue);
    }

    _getResetLocation(startLocation: MyLocation) {
        return this._getModifiedLocation(startLocation, this._def.defaultValue);
    }

    _getModifiedUrl(value: T) {
        return locationToUrl(this._getModifiedLocation(this._tokenManager.getCurrentLocation(), value));
    }

    _getResetUrl() {
        return this._getModifiedUrl(this._def.defaultValue);
    }

    doSet(value: T, method?: UpdateMethod) {
        const rawValue = this.getRawValue(value);
        this._tokenManager.doSetToken(this.key, rawValue, method);
    }

    doReset(method?: UpdateMethod) {
        this.doSet(this._def.defaultValue, method);
    }

    trySet(value: T, method?: UpdateMethod, callback?: SuccessCallback) {
        const rawValue = this.getRawValue(value);
        this._tokenManager.trySetToken(this.key, rawValue, method, callback);
    }

    tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }

    @computed
    get rawValue() {
        return this._currentQuery[this.key];
    }
}
