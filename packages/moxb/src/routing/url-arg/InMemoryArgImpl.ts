import { observable } from 'mobx';
import { UrlArg, UrlArgDefinition } from './UrlArg';
import { AnyUrlArgImpl, UrlArgBackend } from './AnyUrlArgImpl';

class MiniStore implements UrlArgBackend {
    @observable
    raw: string | undefined;

    get rawValue() {
        return this.raw;
    }

    set rawValue(value) {
        this.raw = value;
    }
}

export function createInMemoryArg<T>(definition: UrlArgDefinition<T>): UrlArg<T> {
    return new AnyUrlArgImpl(definition, new MiniStore());
}
