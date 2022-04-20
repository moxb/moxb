import { action, computed, observable, makeObservable } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindOneOfChoice, OneOf } from './OneOf';

export interface OneOfOptions<T> extends ValueOptions<OneOfImpl<T>, T> {
    choices?: ValueOrFunction<BindOneOfChoice<T>[]>;
    searchData?: (value: string) => BindOneOfChoice<T>[];
}

export class OneOfImpl<T = string> extends ValueImpl<OneOfImpl<T>, T, OneOfOptions<T>> implements OneOf<T> {
    _search?: string;

    constructor(impl: OneOfOptions<T>) {
        super(impl);

        makeObservable(this, {
            _search: observable,
            choices: computed,
            choice: computed,
            searchData: action.bound,
            filteredChoices: computed
        });
    }

    get choices(): BindOneOfChoice<T>[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }

    get choice(): string | undefined {
        const choice = this.choices.find((c) => c.value === this.value);
        return choice ? choice.label : undefined;
    }

    searchData(value: string): void {
        this._search = value;
    }

    get filteredChoices(): BindOneOfChoice<T>[] {
        if (this._search && this.impl.searchData) {
            return this.impl.searchData(this._search);
        } else {
            // When no searchData function is given, simple give back all choices
            return this.choices;
        }
    }
}
