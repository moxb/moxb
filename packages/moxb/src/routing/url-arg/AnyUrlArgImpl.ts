import { computed } from 'mobx';

import { ParserFunc, UrlArg, UrlArgDefinition } from './UrlArg';

export interface UrlArgBackend {
    rawValue: string | undefined;
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

    // Extract the value from a given query
    public getOnQuery() {
        return undefined;
    }

    @computed
    public get value() {
        return this.defined ? this._parser(this.backend.rawValue!) : this.defaultValue;
    }

    public getRawValue(value: T) {
        const {
            valueType: { isEqual, format },
            defaultValue,
        } = this._def;
        return isEqual(value, defaultValue) ? undefined : format(value);
    }

    public getModifiedUrl() {
        return undefined;
    }

    public set(value: T) {
        this.backend.rawValue = this.getRawValue(value);
    }

    public set value(value: T) {
        this.set(value);
    }

    public reset() {
        this.set(this._def.defaultValue);
    }

    @computed
    public get rawValue() {
        return this.backend.rawValue;
    }
}