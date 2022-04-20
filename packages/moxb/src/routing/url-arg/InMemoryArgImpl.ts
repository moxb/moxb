import { observable, makeObservable } from 'mobx';
import { AnyUrlArgImpl, UrlArgBackend } from './AnyUrlArgImpl';
import { UrlArg, UrlArgDefinition } from './UrlArg';
import { SuccessCallback, TestLocation } from '../location-manager/LocationManager';

class MiniStore implements UrlArgBackend {
    raw: string | undefined;

    constructor() {
        makeObservable(this, {
            raw: observable
        });
    }

    get rawValue(): string | undefined {
        return this.raw;
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

    set rawValue(value: string | undefined) {
        this.doSet(value);
    }

    rawValueOn(_location: TestLocation): string | undefined {
        return this.rawValue;
    }
}

export function createInMemoryArg<T>(definition: UrlArgDefinition<T>): UrlArg<T> {
    return new AnyUrlArgImpl(definition, new MiniStore());
}
