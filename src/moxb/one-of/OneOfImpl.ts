import { computed } from 'mobx';
import { ValueOrFunction } from '../bind/BindImpl';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { BindOneOfChoice, OneOf } from './OneOf';

export interface OneOfOptions extends ValueOptions<OneOfImpl, string> {
    choices?: ValueOrFunction<BindOneOfChoice[]>;
}

export class OneOfImpl extends ValueImpl<OneOfImpl, string, OneOfOptions> implements OneOf {
    constructor(impl: OneOfOptions) {
        super(impl);
    }

    @computed
    get choices(): BindOneOfChoice[] {
        if (typeof this.impl.choices === 'function') {
            return this.impl.choices() || [];
        } else {
            return this.impl.choices || [];
        }
    }
}
