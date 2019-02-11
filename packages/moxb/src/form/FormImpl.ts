import { action, computed } from 'mobx';
import { extractErrorString, t, Value, ValueOrFunction } from '..';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Form } from './Form';

export interface FormOptions extends BindOptions {
    /**
     * The 'values' contain all the children components bindings
     */
    readonly values: ValueOrFunction<Value<any>[]>;

    /**
     * Is called when Form.onSubmit is called
     * `done` must be called else the binding stays in saving state.
     *
     * @param {value} value
     * @param {(error: any) => void} done
     */
    onSubmit?(value: any, done: (error?: any) => void): void;

    /**
     * If true, the form refreshes the page onSubmit
     */
    doSubmitRefresh?: boolean;
}

export class FormImpl extends BindImpl<FormOptions> implements Form {
    protected getValues(): Value<any>[] {
        if (typeof this.impl.values === 'function') {
            return this.impl.values() || [];
        }
        if (this.impl.values != null) {
            return this.impl.values;
        }
        return [];
    }

    @computed
    get values() {
        return this.getValues();
    }

    constructor(impl: FormOptions) {
        super(impl);
        if (this.impl.values === undefined) {
            throw new Error('The form implementation must have defined children components or a function.');
        }
        if (typeof this.impl.values !== 'function' && !this.impl.values.length) {
            throw new Error('The form implementation must have defined children components.');
        }
    }

    @computed
    get canSubmitForm() {
        return this.values.findIndex(v => v.isInitialValue as boolean) < 0;
    }

    @computed
    get allErrors(): string[] {
        const valuesWithErrors = this.values.filter(v => !!v.errors);
        // Set keeps the items in insertion order
        const allErrors = new Set<string>();
        valuesWithErrors.forEach(v => {
            v.errors!.forEach(error => {
                allErrors.add(v.label ? v.label + ': ' + t(error, error) : t(error, error));
            });
        });
        this.errors!.forEach(error => {
            allErrors.add(this.label ? this.label + ': ' + t(error, error) : t(error, error));
        });
        return Array.from(allErrors);
    }

    @computed
    get hasErrors() {
        return !!(this.values.find(v => v.errors!.length > 0) || this.errors!.length > 0);
    }

    @computed
    get hasChanges() {
        return !this.values.every(v => (v.isInitialValue === undefined ? true : v.isInitialValue));
    }

    @action.bound
    onSubmitForm(evt?: any) {
        if (!this.impl.doSubmitRefresh && evt) {
            evt.preventDefault();
        }
        this.values.forEach(v => v.save());
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
        this.values.forEach(v => v.resetToInitialValue());
    }

    @action.bound
    clearAllErrors() {
        if (this.values) {
            this.values.forEach(v => v.clearErrors());
            this.clearErrors();
        }
    }
}
