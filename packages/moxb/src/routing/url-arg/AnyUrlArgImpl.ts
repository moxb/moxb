import { computed } from 'mobx';

import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';
import { SuccessCallback, TestLocation, UpdateMethod } from '../location-manager/LocationManager';

export interface UrlArgBackend {
    readonly rawValue: string | undefined;
    rawValueOn(location: TestLocation | undefined): string | undefined;
    doSet: (value: string) => void;
    trySet: (value: string, callback?: SuccessCallback) => void;
    getModifiedUrl?: (value: string) => string | undefined;
}

export class AnyUrlArgImpl<T> implements UrlArg<T> {
    private readonly _def: UrlArgDefinition<T>;
    private readonly _parser: ParserFunc<T>;
    public readonly key: string;
    public readonly defaultValue: T;

    public constructor(definition: UrlArgDefinition<T>, protected readonly backend: UrlArgBackend) {
        const { parser, valueType, key } = (this._def = definition);
        this._parser = parser || valueType.getParser(key);
        this.key = this._def.key;
        this.defaultValue = this._def.defaultValue;
    }

    @computed
    public get defined() {
        return this.backend.rawValue !== undefined;
    }

    // // Extract the value from a given query
    // public getOnQuery() {
    //     return undefined;
    // }

    @computed
    public get value() {
        return this.defined ? this._parser(this.backend.rawValue!) : this.defaultValue;
    }

    definedOn(location: TestLocation) {
        return this.backend.rawValueOn(location) !== undefined;
    }

    valueOn(location: TestLocation) {
        return this.definedOn(location) ? this._parser(this.backend.rawValueOn(location)!) : this.defaultValue;
    }

    public getRawValue(value: T): string {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue)
            ? format(defaultValue) // TODO: this might not be the right thing to say here.
            : format(value);
    }

    public getModifiedUrl(value: T) {
        const getter = this.backend.getModifiedUrl;
        if (!getter) {
            return undefined;
        }
        return getter(this.getRawValue(value));
    }

    public doSet(value: T) {
        this.backend.doSet(this.getRawValue(value));
    }

    public doReset() {
        this.doSet(this._def.defaultValue);
    }

    public trySet(value: T, _method?: UpdateMethod, callback?: SuccessCallback) {
        this.backend.trySet(this.getRawValue(value), callback);
    }

    public tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }

    @computed
    public get rawValue() {
        return this.backend.rawValue;
    }
}
