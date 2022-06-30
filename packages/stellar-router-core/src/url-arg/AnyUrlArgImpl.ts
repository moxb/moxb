import { computed, makeObservable } from 'mobx';

import { ArgDefinitionCore, ParserFunc, UrlArg } from './UrlArg';
import { MyLocation, SuccessCallback, UpdateMethod } from '../location-manager/LocationManager';
import { TestLocation } from '../location-manager/TestLocation';

export interface UrlArgBackend {
    readonly rawValue?: string;
    rawValueOn(location: TestLocation | undefined): string | undefined;
    doSet: (value: string) => void;
    trySet: (value: string, callback?: SuccessCallback) => void;
    _getModifiedLocation?: (start: MyLocation, value: string) => MyLocation;
    _getModifiedUrl?: (value: string) => string | undefined;
}

export class AnyUrlArgImpl<T> implements UrlArg<T> {
    private readonly _def: ArgDefinitionCore<T>;
    private readonly _parser: ParserFunc<T>;
    readonly _defaultValue: T;

    constructor(definition: ArgDefinitionCore<T>, protected readonly backend: UrlArgBackend) {
        makeObservable(this);
        const { parser, valueType } = (this._def = definition);
        this._parser = parser || valueType.getParser(JSON.stringify(definition));
        this._defaultValue = this._def.defaultValue;
    }

    @computed
    get _defined() {
        return this.backend.rawValue !== undefined;
    }

    @computed
    get value() {
        return this._defined ? this._parser(this.backend.rawValue!) : this._defaultValue;
    }

    definedOn(location: TestLocation) {
        return this.backend.rawValueOn(location) !== undefined;
    }

    _valueOn(location: TestLocation) {
        return this.definedOn(location) ? this._parser(this.backend.rawValueOn(location)!) : this._defaultValue;
    }

    getRawValue(value: T): string {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue)
            ? format(defaultValue) // TODO: this might not be the right thing to say here.
            : format(value);
    }

    _getModifiedLocation(start: MyLocation, value: T) {
        const getter = this.backend._getModifiedLocation;
        if (!getter) {
            return start;
        }
        return getter(start, this.getRawValue(value));
    }

    _getModifiedUrl(value: T) {
        const getter = this.backend._getModifiedUrl;
        if (!getter) {
            return undefined;
        }
        return getter(this.getRawValue(value));
    }

    _getResetLocation(start: MyLocation) {
        return this._getModifiedLocation(start, this._def.defaultValue);
    }

    _getResetUrl() {
        return this._getModifiedUrl(this._def.defaultValue);
    }

    doSet(value: T) {
        this.backend.doSet(this.getRawValue(value));
    }

    doReset() {
        this.doSet(this._def.defaultValue);
    }

    trySet(value: T, _method?: UpdateMethod, callback?: SuccessCallback) {
        this.backend.trySet(this.getRawValue(value), callback);
    }

    tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySet(this._def.defaultValue, method, callback);
    }

    @computed
    get rawValue() {
        return this.backend.rawValue;
    }
}
