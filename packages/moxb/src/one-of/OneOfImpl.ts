import { action, computed, observable } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindOneOfChoice, OneOf } from './OneOf';

export interface OneOfOptions<T> extends ValueOptions<OneOfImpl, T> {
    choices?: ValueOrFunction<BindOneOfChoice<T>[]>;
    searchData?: (value: string) => BindOneOfChoice<T>[];
}

export class OneOfImpl<T = string> extends ValueImpl<OneOfImpl, T, OneOfOptions<T>> implements OneOf<T> {
    @observable
    _search?: string;

    constructor(impl: OneOfOptions<T>) {
        super(impl);
    }

    @computed
    get choices(): BindOneOfChoice<T>[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }

    @computed
    get choice(): string | undefined {
        const choice = this.choices.find((c) => c.value === this.value);
        return choice ? choice.label : undefined;
    }

    @action.bound
    searchData(value: string): void {
        this._search = value;
    }

    @computed
    get filteredChoices(): BindOneOfChoice<T>[] {
        if (this._search && this.impl.searchData) {
            return this.impl.searchData(this._search);
        } else {
            // When no searchData function is given, simple give back all choices
            return this.choices;
        }
    }
}
