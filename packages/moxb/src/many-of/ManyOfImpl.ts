import { computed } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { BindOneOfChoice } from '../one-of/OneOf';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindManyOfChoice, ManyOf } from './ManyOf';

export interface ManyOfOptions<T> extends ValueOptions<ManyOfImpl, T[]> {
    choices?: ValueOrFunction<BindOneOfChoice<T>[]>;
    verticalDisplay?: ValueOrFunction<boolean>;
}

export class ManyOfImpl<T = string> extends ValueImpl<ManyOfImpl, T[], ManyOfOptions<T>> implements ManyOf<T> {
    constructor(impl: ManyOfOptions<T>) {
        super(impl);
    }

    @computed
    get choices(): BindManyOfChoice<T>[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }

    @computed
    get verticalDisplay(): boolean {
        if (typeof this.impl.verticalDisplay === 'function') {
            return this.impl.verticalDisplay() || false;
        } else {
            return this.impl.verticalDisplay || false;
        }
    }
}
