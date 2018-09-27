import { action, computed, observable } from 'mobx';
import { BindImpl, BindOptions, StringOrFunction, ValueOrFunction } from '../bind/BindImpl';
import { t } from '../i18n/i18n';
import { extractErrorString } from '../validation/ErrorMessage';
import { Value } from './Value';

export interface ValueOptions<B, T> extends BindOptions {
    inputType?: string;

    initialValue?: ValueOrFunction<T>;

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
     * @param {Value<T>} value
     * @param {(error: any) => void} done
     */
    onSave?(value: B, done: (error?: any) => void): void;

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

export abstract class ValueImpl<B, T, Options extends ValueOptions<B, T>> extends BindImpl<Options>
    implements Value<T> {
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

    private getInitialValue() {
        if (typeof this.impl.initialValue === 'function') {
            return this.impl.initialValue();
        } else {
            return this.impl.initialValue;
        }
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
            console.warn(`cannot fire disabled value ${this.id} '${this.label}'`);
        }
    }

    @computed
    get isInitialValue() {
        if (this.impl.initialValue === undefined) {
            return undefined;
        } else {
            return this.getInitialValue() === this.value;
        }
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
    }
}
