import { observable } from 'mobx';
import { AnyUrlArgImpl, UrlArgBackend } from './AnyUrlArgImpl';
import { UrlArg, UrlArgDefinition } from './UrlArg';
import { TestLocation } from '../location-manager/LocationManager';

class MiniStore implements UrlArgBackend {
    @observable
    raw: string | undefined;

    get rawValue(): string | undefined {
        return this.raw;
    }

    doSet(value: string | undefined) {
        this.raw = value;
    }

    trySet(value: string | undefined): Promise<boolean> {
        this.raw = value;
        return Promise.resolve(true);
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
