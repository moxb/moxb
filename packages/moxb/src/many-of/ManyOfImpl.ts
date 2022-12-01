import { computed, makeObservable } from 'mobx';
import { ValueOrFunction } from '@moxb/util';
import { BindOneOfChoice } from '../one-of/OneOf';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindManyOfChoice, ManyOf } from './ManyOf';

export interface ManyOfOptions<T> extends ValueOptions<ManyOfImpl<T>, T[]> {
    choices?: ValueOrFunction<BindOneOfChoice<T>[]>;
}

export class ManyOfImpl<T = string> extends ValueImpl<ManyOfImpl<T>, T[], ManyOfOptions<T>> implements ManyOf<T> {
    constructor(impl: ManyOfOptions<T>) {
        super({
            valueCompareFunction: (a, b) => a.slice().sort().toString() === b.slice().sort().toString(),
            ...impl,
        });
        makeObservable(this);
    }

    @computed
    get choices(): BindManyOfChoice<T>[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }

    isSelected(choice: T): boolean {
        return !!this.value && this.value.indexOf(choice) !== -1;
    }

    toggle(choice: T) {
        if (this.isSelected(choice)) {
            // Un-select this
            this.setValue((this.value || []).filter((c) => c !== choice));
        } else {
            // Select this
            this.setValue([...(this.value || []), choice]);
        }
    }
}
