import { computed } from 'mobx';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Text } from './Text';

export interface TextOptions extends ValueOptions<TextImpl, string> {
    control?: 'input' | 'textarea';
}

export class TextImpl extends ValueImpl<TextImpl, string, TextOptions> implements Text {
    constructor(impl: TextOptions) {
        super(impl);
    }

    @computed
    get control() {
        return this.impl.control === undefined ? 'input' : this.impl.control;
    }
}
