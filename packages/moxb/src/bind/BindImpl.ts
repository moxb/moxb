import { action, computed, observable, makeObservable } from 'mobx';
import {
    AnyDecision,
    readDecision,
    readReason,
    t,
    bindAllTo,
    idToDomId,
    StringOrFunction,
    ValueOrFunction,
} from '@moxb/util';

import { Bind } from './Bind';

/**
 * Used to set up {Bind} objects
 */
export interface BindOptions<CustomData = undefined> {
    id: string;
    /**
     * If label is a function it assumes that the function returns a translated label.
     * If label is a string, the assumption is that this is the default translation and the translation key is `id.label`
     */
    label?: StringOrFunction;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     *
     * @returns {boolean} `true` if the element should be disabled
     */
    disabled?(): AnyDecision;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     * @returns {boolean} `false` if the element should be disabled
     */
    enabled?(): AnyDecision;

    /**
     * If true the associated UI element does not show up in the UI (as if it would be `null`)
     * @returns {boolean}
     */
    invisible?(): boolean;

    /**
     * Can the structure be edited -- to not confuse with the typescript keyword `readonly`, we use camelCase
     * @returns {boolean}
     */
    readOnly?(): boolean;

    /**
     * If help is a function it assumes that the function returns a translated help.
     * If help is a string, the assumption is that this is the default translation and the translation key is `id.help`
     */
    help?: StringOrFunction;

    getErrors?(): string[] | undefined;

    setError?(error: string | undefined | null): void;

    clearErrors?(): void;

    validateField?(): void;

    customData?: ValueOrFunction<CustomData>;
}

export class BindImpl<Options extends BindOptions<CustomData>, CustomData = undefined> implements Bind<CustomData> {
    readonly id: string;
    readonly domId: string;
    protected readonly impl: Options;
    @observable
    _errors?: string[] | undefined | null;

    constructor(impl: Options) {
        makeObservable(this);
        // tslint complains about Object.assign and typescript can not spread interfaces:
        //   TS2698: Spread types may only be created from object types.
        // tslint:disable-next-line prefer-object-spread
        this.impl = bindAllTo(this, { ...impl });
        this.id = impl.id;
        this._errors = [];
        if (!this.id.match(/^\w[\w\d.]*$/)) {
            throw new Error(`'${this.id}' is not a valid id!`);
        }
        this.domId = idToDomId(this.id);
        if (impl.enabled && impl.disabled) {
            throw new Error('You  can either specify enabled or disabled!');
        }
        //moxb all methods...
        bindAllTo(this, this);
    }

    @computed
    get label() {
        return this.getLabel();
    }

    protected getLabel() {
        if (typeof this.impl.label === 'function') {
            return this.impl.label();
        }
        if (this.impl.label != null) {
            return t(this.id + '.label', this.impl.label);
        }
        return undefined;
    }

    @computed
    get disabled() {
        return this.getDisabled();
    }

    protected getDisabled(): boolean {
        if (this.impl.disabled) {
            return readDecision(this.impl.disabled());
        }
        if (this.impl.enabled) {
            return !readDecision(this.impl.enabled());
        }
        return false;
    }

    @computed
    get enabled() {
        return !this.disabled;
    }

    @computed
    get reason() {
        return this.getReason();
    }

    protected getReason() {
        if (this.impl.disabled) {
            return readReason(this.impl.disabled());
        }
        if (this.impl.enabled) {
            return readReason(this.impl.enabled());
        }
        return undefined;
    }

    @computed
    get invisible() {
        return this.getInvisible();
    }

    protected getInvisible() {
        if (this.impl.invisible) {
            return !!this.impl.invisible();
        }
        return false;
    }

    @computed
    get readOnly() {
        return this.getReadonly();
    }

    protected getReadonly() {
        if (this.impl.readOnly) {
            return !!this.impl.readOnly();
        }
        return false;
    }

    @computed
    get help() {
        return this.getHelp();
    }

    protected getHelp() {
        if (typeof this.impl.help === 'function') {
            return this.impl.help();
        }
        if (this.impl.help != null) {
            return t(this.id + '.help', this.impl.help);
        }
        return undefined;
    }

    @computed
    get errors() {
        return this.getErrors();
    }

    @computed
    get errorMessage(): string | undefined {
        return this.errors ? this.errors.join(' ') : undefined;
    }

    /** @deprecated since version v0.2.0-beta.7 */
    @computed
    get error() {
        if (this.hasErrors) {
            return this.getErrors().join(' ');
        } else {
            return undefined;
        }
    }

    @computed
    get hasErrors() {
        return this.errors!.length > 0;
    }

    @action
    setError(error: string | undefined | null) {
        if (this.impl.setError) {
            this.impl.setError(error);
        } else {
            this._errors!.push(error!);
        }
    }

    protected getErrors(): string[] {
        const errors = (this.impl.getErrors && this.impl.getErrors()) || [];
        // Set keeps the items in insertion order
        return Array.from(new Set([...errors, ...(this._errors || [])]));
    }

    @action.bound
    clearErrors() {
        this.doClearErrors();
    }

    /** @deprecated since version v0.2.0-beta.7 */
    @action.bound
    clearError() {
        this.doClearErrors();
    }

    protected doClearErrors() {
        if (this.impl.clearErrors) {
            this.impl.clearErrors();
        }
        this._errors = [];
    }

    @action.bound
    validateField() {
        this.doOnValidate();
    }

    protected doOnValidate() {
        if (this.impl.validateField) {
            this.impl.validateField();
        }
    }

    get customData() {
        if (typeof this.impl.customData === 'function') {
            return (this.impl.customData as () => CustomData)();
        }
        if (this.impl.customData) {
            return this.impl.customData;
        }
        return undefined;
    }
}
