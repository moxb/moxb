import { computed } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindOneOfChoice, OneOf } from './OneOf';

export interface OneOfOptions<T> extends ValueOptions<OneOfImpl, T> {
    choices?: ValueOrFunction<BindOneOfChoice<T>[]>;
}

export class OneOfImpl<T = string> extends ValueImpl<OneOfImpl, T, OneOfOptions<T>> implements OneOf<T> {
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
        const choice = this.choices.find(c => c.value === this.value);
        return choice ? choice.label : undefined;
    }
}
