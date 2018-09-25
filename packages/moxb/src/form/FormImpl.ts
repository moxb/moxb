import { computed, action } from 'mobx';
import { BindOptions, Value, t } from '..';
import { Form } from './Form';

export interface FormOptions extends BindOptions {
    readonly values: Value<any>[];
}

export class FormImpl implements Form {
    readonly impl: FormOptions;

    constructor(impl: FormOptions) {
        this.impl = impl;
    }

    @computed
    get canSubmitForm() {
        if (this.impl.values) {
            return this.impl.values.findIndex(v => !v.isInitialValue) >= 0;
        }
        return false;
    }

    @computed
    get errors(): string[] {
        if (this.impl.values) {
            return this.impl.values.filter(v => !!v.error).map(v => v.label + ': ' + t(v.error!, v.error!));
        }
        return [];
    }

    @computed
    get hasErrors() {
        if (this.impl.values) {
            return !!this.impl.values.find(v => !!v.error);
        }
        return false;
    }

    @action.bound
    onSubmitForm() {
        if (this.impl.values) {
            console.log('onSubmitForm');
            this.impl.values.forEach(v => v.save());
        }
    }

    @action.bound
    clearErrors() {
        if (this.impl.values) {
            this.impl.values.forEach(v => v.clearError());
        }
    }
}
