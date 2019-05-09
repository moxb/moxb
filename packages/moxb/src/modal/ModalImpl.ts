import { action, observable } from 'mobx';
import { Modal, ModalActions } from './Modal';

export interface ModalOptions<T, A> {
    header?(data: T): string;
    actions(data: T): A;
    onClose?(): void;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
}

export class ModalImpl<T, A extends ModalActions = ModalActions> implements Modal<T, A> {
    @observable
    open = false;
    @observable
    data!: T;
    private readonly impl: ModalOptions<T, A>;

    constructor(impl: ModalOptions<T, A>) {
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
        return this.impl.actions(this.data);
    }

    get header() {
        if (this.open && this.impl.header) {
            return this.impl.header(this.data);
        }
        return '';
    }
}
