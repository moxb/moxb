import { computed, makeObservable } from 'mobx';
import { StringOrFunction } from '../bind/BindImpl';
import { t } from '../i18n/i18n';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Bool } from './Bool';

export interface BoolOptions extends ValueOptions<BoolImpl, boolean> {
    /**
     * Label when State is true
     */
    labelTrue?: StringOrFunction;
    /**
     * Label when State is false
     */
    labelFalse?: StringOrFunction;
}

// ToDo: Use the Bool interface instead of the BoolImpl
// ToDo: do the same for all types
export class BoolImpl extends ValueImpl<BoolImpl, boolean, BoolOptions> implements Bool {
    constructor(impl: BoolOptions) {
        super(impl);

        makeObservable(this, {
            labelToggle: computed
        });
    }

    toggle() {
        this.setValue(!this.value);
    }
    get labelToggle() {
        return this.getLabelToggle();
    }
    getLabel() {
        const label = super.getLabel();
        if (label == null) {
            return this.getLabelToggle();
        }
        return label;
    }
    protected getLabelToggle() {
        if (this.value) {
            if (typeof this.impl.labelTrue === 'function') {
                return this.impl.labelTrue();
            }
            if (this.impl.labelTrue != null) {
                return t(this.id + '.label.true', this.impl.labelTrue);
            }
        } else {
            if (typeof this.impl.labelFalse === 'function') {
                return this.impl.labelFalse();
            }
            if (this.impl.labelFalse != null) {
                return t(this.id + '.label.false', this.impl.labelFalse);
            }
        }
        return super.getLabel();
    }
}
