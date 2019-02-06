import { computed } from 'mobx';
import { SuccessCallback, UpdateMethod } from '../location-manager';
import { TokenManager } from '../TokenManager';
import { Query } from '../url-schema/UrlSchema';
import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { existsInQuery, getFromQuery } from './UrlArgImpl';
import { TestLocation } from '../location-manager/LocationManager';

export class UrlTokenImpl<T> implements UrlArg<T> {
    private readonly _def: UrlArgDefinition<T>;
    private readonly _parser: ParserFunc<T>;
    public readonly key: string;
    public readonly defaultValue: T;

    public constructor(private readonly _tokenManager: TokenManager, definition: UrlArgDefinition<T>) {
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        this.key = this._def.key;
        this.defaultValue = this._def.defaultValue;
    }

    @computed
    private get _currentQuery() {
        return this._tokenManager.tokens;
    }

    @computed
    public get defined() {
        return existsInQuery(this._currentQuery, this.key);
    }

    // Extract the value from a given query
    getOnQuery(query: Query) {
        const { defaultValue } = this._def;
        return getFromQuery(query, this.key, this._parser, defaultValue);
    }

    @computed
    public get value() {
        return this.getOnQuery(this._currentQuery);
    }

    valueOn(location: TestLocation) {
        return this.getOnQuery(location.query);
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
        return this._tokenManager.getURLForTokenChange(this.key, rawValue);
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

    @computed
    public get rawValue() {
        return this._currentQuery[this.key];
    }
}
