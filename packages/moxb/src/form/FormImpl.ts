import { computed, action } from 'mobx';
import { Value, t, extractErrorString } from '..';
import { Form } from './Form';
import { BindImpl, BindOptions } from '../bind/BindImpl';

export interface FormOptions extends BindOptions {
    /**
     * The 'values' contain all the children components bindings
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

    /**
     * If true, the form refreshes the page onSubmit
     */
    doSubmitRefresh?: boolean;
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
        return this.impl.values.findIndex(v => v.isInitialValue as boolean) < 0;
    }

    @computed
    get allErrors(): string[] {
        const valuesWithErrors = this.impl.values.filter(v => !!v.errors);
        const allErrors: string[] = [];
        valuesWithErrors.forEach(v => {
            v.errors!.forEach(error => {
                allErrors.push(v.label ? v.label + ': ' + t(error, error) : t(error, error));
            });
        });
        this.errors!.forEach(error => {
            allErrors.push(this.label ? this.label + ': ' + t(error, error) : t(error, error));
        });
        return allErrors;
    }

    @computed
    get hasErrors() {
        return !!(this.impl.values.find(v => v.errors!.length > 0) || this.errors!.length > 0);
    }

    @computed
    get hasChanges() {
        return !this.impl.values.every(v => {
            return v.isInitialValue === undefined ? true : v.isInitialValue;
        });
    }

    @action.bound
    onSubmitForm(evt?: any) {
        if (!this.impl.doSubmitRefresh && evt) {
            evt.preventDefault();
        }
        this.impl.values.forEach(v => v.save());
        if (this.impl.onSubmit) {
            this.impl.onSubmit(this as any, this.submitDone);
        }
    }

    @action.bound
    submitDone(error: any) {
        if (error) {
            this.setError(extractErrorString(error));
        } else {
            this.clearErrors();
        }
    }

    @action.bound
    resetValues() {
        this.impl.values.forEach(v => v.resetToInitialValue());
    }

    @action.bound
    clearAllErrors() {
        if (this.impl.values) {
            this.impl.values.forEach(v => v.clearErrors());
            this.clearErrors();
        }
    }
}
