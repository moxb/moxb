import { action, comparer, computed, observable } from 'mobx';
import { BindImpl, BindOptions, getValueOrFunction, StringOrFunction, ValueOrFunction } from '../bind/BindImpl';
import { t } from '../i18n/i18n';
import { extractErrorString } from '../validation/ErrorMessage';
import { Value } from './Value';

const defaultIsGivenFunction = (value: any) => !!value;

export interface ValueOptions<B, T> extends BindOptions {
    inputType?: string;

    /**
     * Is this value required?
     *
     * If yes, you probably won't be able to save a form if not given. (See isGiven below)
     */
    required?: boolean;

    /**
     * A function used to detect if this value is "given". (whatever that means in the context.)
     * This will be used to test the presence of required values.
     */
    isGiven?: (value: T | undefined | null) => boolean;

    initialValue?: ValueOrFunction<T>;

    /**
     * A function used to compare the initialValue with the current value.
     * It defaults to mobx.comparer.structural.
     * @param a
     * @param b
     */
    valueCompareFunction?(a: T, b: T): boolean;

    setValue?(value: T): void; // is bound!

    getValue?(): T | undefined;

    /**
     * If setValue is specified and this is specified, this is used to reset the value to
     * the initial value.
     */
    resetToInitialValue?(): void;

    /**
     * If placeholder is a function it assumes that the function returns a translated placeholder.
     * If placeholder is a string, the assumption is that this is the default translation and the translation key is `id.placeholder`
     */
    placeholder?: StringOrFunction;

    /**
     * Is called when Value.save is called and Value.isInitialValue is false.
     * `done` must be called else the binding stays in saving state.
     *
     * @param {Value<T>} bind
     * @param {(error: any) => void} done
     */
    onSave?(bind: B, done: (error?: any) => void): void;

    onExitField?(bind: B): void;
    onEnterField?(bind: B): void;

    /**
     * This is called when the value is set. It can transform the value.
     * @param {T} value
     * @param {Value<T>} bind
     */
    onSetValue?(value: T, bind: B): T;

    /**
     * Called after the value has been set.
     *
     * @param {T} value
     * @param {Value<T>} bind
     */
    onAfterSetValue?(value: T, bind: B): void;
}

export class ValueImpl<B, T, Options extends ValueOptions<B, T>> extends BindImpl<Options> implements Value<T> {
    /**
     * default value impl
     */
    @observable
    _value?: T | undefined;
    @observable
    _isSaving = false;

    constructor(impl: Options) {
        super(impl);
        if (!!this.impl.setValue !== !!this.impl.getValue) {
            throw new Error('getValue and setValue must both be specified or none!');
        }
    }

    protected implValOrUndefined(key: string) {
        if ((this.impl as any)[key]) {
            const val = (this.impl as any)[key];
            if (typeof val === 'function') {
                return val();
            } else {
                return val;
            }
        } else {
            return undefined;
        }
    }

    private getInitialValue(): T | undefined {
        return getValueOrFunction(this.impl.initialValue);
    }
    @computed
    get inputType() {
        return this.impl.inputType;
    }

    @computed
    get value(): T | undefined {
        return this.doGetValue();
    }

    private doGetValue(): T | undefined {
        let value: T | undefined;
        if (this.impl.getValue) {
            value = this.impl.getValue();
            if (typeof value !== 'undefined') {
                return value;
            }
        } else {
            if (typeof this._value !== 'undefined') {
                return this._value;
            }
        }
        return this.getInitialValue();
    }

    @computed
    get placeholder() {
        return this.doPlaceholder();
    }

    private doPlaceholder() {
        if (typeof this.impl.placeholder === 'function') {
            return this.impl.placeholder();
        }
        if (this.impl.placeholder != null) {
            return t(this.id + '.placeholder', this.impl.placeholder);
        }
        return undefined;
    }

    @computed
    get required() {
        return this.impl.required;
    }

    @computed
    get isGiven() {
        const testFunction = this.impl.isGiven || defaultIsGivenFunction;
        return testFunction(this.value);
    }

    @action.bound
    setValue(value: T) {
        if (this.impl.onSetValue) {
            value = this.impl.onSetValue(value, this as any);
        }
        this.doSetValue(value);
        if (this.impl.onAfterSetValue) {
            this.impl.onAfterSetValue(value, this as any);
        }
    }

    private doSetValue(value: T) {
        if (!this.readOnly && this.enabled) {
            if (this.impl.setValue) {
                this.impl.setValue(value);
            } else {
                const hasChanged = this._value !== value;
                this._value = value;
                if (hasChanged) {
                    this.clearErrors();
                }
            }
        } else {
            console.warn(`cannot set disabled value ${this.id} '${this.label}'`);
        }
    }

    @computed
    get isInitialValue() {
        if (this.impl.initialValue === undefined) {
            return undefined;
        } else {
            return this.compare(this.getInitialValue(), this.value);
        }
    }
    protected compare(a: T | undefined, b: T | undefined) {
        if (a === b) {
            return true;
        }
        if (a === undefined || b === undefined) {
            return false;
        }
        if (this.impl.valueCompareFunction) {
            return this.impl.valueCompareFunction(a, b);
        }
        return comparer.structural(a, b);
    }
    @action.bound
    resetToInitialValue() {
        if (this.impl.setValue) {
            if (!this.impl.resetToInitialValue) {
                throw new Error('No resetToInitialValue specified in options');
            }
            this.impl.resetToInitialValue();
        }

        this._value = undefined;
    }

    @action.bound
    save() {
        if (this.impl.required && !this.isGiven) {
            this.setError(t('ValueImpl.error.required', 'This field is required and must be set'));
        }
        if (this.impl.onSave && !this.isInitialValue) {
            this._isSaving = true;
            this.impl.onSave(this as any, this.saveDone);
        }
    }
    @action.bound
    private saveDone(error: any) {
        if (error) {
            this.setError(extractErrorString(error));
        } else {
            this.clearErrors();
        }
        this._isSaving = false;
    }
    get isSaving() {
        return this._isSaving;
    }
    @action.bound
    onEnterField() {
        if (this.impl.onEnterField) {
            this.impl.onEnterField(this as any);
        }
    }

    @action.bound
    onExitField() {
        if (this.impl.onExitField) {
            this.impl.onExitField(this as any);
        }
        if (this.impl.required && !this.isGiven) {
            this.setError(t('ValueImpl.error.required', 'This field is required and must be set'));
        }
    }
}
