import { observable } from 'mobx';
import { AnyUrlArgImpl, UrlArgBackend } from './AnyUrlArgImpl';
import { UrlArg, UrlArgDefinition } from './UrlArg';

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
