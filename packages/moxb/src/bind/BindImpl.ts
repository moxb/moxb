import { action, computed, observable } from 'mobx';
import { t } from '../i18n/i18n';
import { bindAllTo } from '../util/bindAllTo';
import { Bind } from './Bind';

export type ValueOrFunction<T> = T | (() => T | undefined) | undefined;

export function getValueOrFunction<T>(value: ValueOrFunction<T>): T | undefined {
    if (typeof value === 'function') {
        return value();
    } else {
        return value;
    }
}

/**
 * Converts a string to a css id. Note that ids and classes in css are case insensitive, and therefore we convert
 * camel case into lower cases.
 * @param {string | null | undefined} id
 * @returns {string}
 */
export function idToDomId(id: string | null | undefined) {
    return (id || '')
        .replace(/[^-\w\d]+/g, '-')
        .replace(/\.?([A-Z]+)/g, (x, v) => '_' + v.toLowerCase()) // to camel case
        .replace(/^([\d_-]+)/, '') // start with alpha numeric
        .replace(/[-_]{2,}/g, '-') // no double dashes and _-
        .replace(/^[-_]/g, '') // no _ - at the beginning
        .replace(/[-_]$/g, ''); // no _ - at the end
}

export type StringOrFunction = ValueOrFunction<string>;
export function getValueFromStringOrFunction(value: StringOrFunction): string | undefined {
    return getValueOrFunction(value);
}

/**
 * Used to set up {Bind} objects
 */
export interface BindOptions {
    id: string;
    /**
     * If label is a function it assumes that the function returns a translated label.
     * If label is a string, the assumption is that this is the default translation and the translation key is `id.label`
     */
    label?: StringOrFunction;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     *
     * @returns {boolean} `true` if the the element should be disabled
     */
    disabled?(): boolean;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     * @returns {boolean} `false` if the element should be disabled
     */
    enabled?(): boolean;

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

    getError?(): string | undefined | null;
    setError?(error: string | undefined | null): void;
    clearError?(): void;
    validateField?(): void;
}

export class BindImpl<Options extends BindOptions> implements Bind {
    readonly id: string;
    readonly domId: string;
    protected readonly impl: Options;
    @observable _error?: string | undefined | null;

    constructor(impl: Options) {
        // tslint commplains about Object.assign and typescript can not spread interfaces:
        //   TS2698: Spread types may only be created from object types.
        // tslint:disable-next-line prefer-object-spread
        this.impl = bindAllTo(this, Object.assign({}, impl));
        this.id = impl.id;
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
    protected getDisabled() {
        if (this.impl.disabled) {
            return !!this.impl.disabled();
        }
        if (this.impl.enabled) {
            return !this.impl.enabled();
        }
        return false;
    }

    @computed
    get enabled() {
        return !this.disabled;
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
    get error() {
        return this.getError();
    }
    setError(error: string | undefined | null) {
        if (this.impl.setError) {
            this.impl.setError(error);
        } else {
            this._error = error;
        }
    }
    protected getError() {
        if (this.impl.getError) {
            return this.impl.getError();
        } else {
            return this._error;
        }
    }

    @action.bound
    clearError() {
        this.doClearError();
    }

    protected doClearError() {
        if (this.impl.clearError) {
            this.impl.clearError();
        }
        this._error = undefined;
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
}
