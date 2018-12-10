import { observable, action } from 'mobx';

/***
 * Bit is a reactive, single-bit data store.
 */
export interface Bit {
    readonly value: boolean;
    set(): void;
    reset(): void;
}

export class BitImpl implements Bit {
    @observable
    protected _value = false;

    get value() {
        return this._value;
    }

    @action
    set() {
        this._value = true;
    }

    @action
    reset() {
        this._value = false;
    }
}
