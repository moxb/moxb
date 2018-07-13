import { computed } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { BindOneOfChoice } from '../one-of/OneOf';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindManyOfChoice, ManyOf } from './ManyOf';

export interface ManyOfOptions extends ValueOptions<ManyOfImpl, string[]> {
    choices?: ValueOrFunction<BindOneOfChoice[]>;
}

export class ManyOfImpl extends ValueImpl<ManyOfImpl, string[], ManyOfOptions> implements ManyOf {
    constructor(impl: ManyOfOptions) {
        super(impl);
    }

    @computed
    get choices(): BindManyOfChoice[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }
}
