import { action, observable } from 'mobx';
import { Action } from '../action/Action';
import { Modal } from './Modal';

export interface ModalOptions<T> {
    header?(data: T): string;
    actions?(data: T): Action[];
    onClose?(): void;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
}

export class ModalImpl<T> implements Modal<T> {
    @observable
    open = false;
    @observable
    data!: T;
    private readonly impl: ModalOptions<T>;

    constructor(impl: ModalOptions<T>) {
        this.impl = impl;
    }

    @action.bound
    show(data: T) {
        this.data = data;
        this.open = true;
    }
    close() {
        this.onClose();
    }
    @action.bound
    onClose() {
        this.open = false;
        if (this.impl.onClose) {
            this.impl.onClose();
        }
    }

    get size() {
        return this.impl.size;
    }

    get actions() {
        if (this.impl.actions) {
            return this.impl.actions(this.data);
        }
    }

    get header() {
        if (this.open && this.impl.header) {
            return this.impl.header(this.data);
        }
        return '';
    }
}
