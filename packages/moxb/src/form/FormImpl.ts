import { computed, action } from 'mobx';
import { Value, t, extractErrorString } from '..';
import { Form } from './Form';
import { BindImpl, BindOptions } from '../bind/BindImpl';

export interface FormOptions extends BindOptions {
    /**
     *
     */
    readonly values: Value<any>[];
    /**
     * Is called when Form.onSubmit is called
     * `done` must be called else the binding stays in saving state.
     *
     * @param {value<T>} value
     * @param {(error: any) => void} done
     */
    onSubmit?(value: any, done: (error?: any) => void): void;
}

export class FormImpl extends BindImpl<FormOptions> implements Form {
    constructor(impl: FormOptions) {
        super(impl);
        if (this.impl.values.length === 0) {
            throw new Error('The form implementation must have defined children components.');
        }
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
            this.impl.values.forEach(v => v.save());
        }
        if (this.impl.onSubmit) {
            this.impl.onSubmit(this as any, this.submitDone);
        }
    }

    @action.bound
    private submitDone(error: any) {
        if (error) {
            this.setError(extractErrorString(error));
        } else {
            this.clearErrors();
        }
    }

    @action.bound
    clearErrors() {
        if (this.impl.values) {
            this.impl.values.forEach(v => v.clearError());
        }
    }
}
