import { observable, makeObservable } from 'mobx';
import { AnyUrlArgImpl, UrlArgBackend } from './AnyUrlArgImpl';
import { UrlArg, UrlArgDefinition } from './UrlArg';
import { SuccessCallback } from '../location-manager/LocationManager';

class MiniStore implements UrlArgBackend {
    @observable
    raw?: string;

    constructor() {
        makeObservable(this);
    }

    get rawValue(): string | undefined {
        return this.raw;
    }

    set rawValue(value: string | undefined) {
        this.doSet(value);
    }

    doSet(value: string | undefined) {
        this.raw = value;
    }

    trySet(value?: string, callback?: SuccessCallback): void {
        this.raw = value;
        if (callback) {
            callback(true);
        }
    }

    rawValueOn(): string | undefined {
        return this.rawValue;
    }
}

export function createInMemoryArg<T>(definition: UrlArgDefinition<T>): UrlArg<T> {
    return new AnyUrlArgImpl(definition, new MiniStore());
}
