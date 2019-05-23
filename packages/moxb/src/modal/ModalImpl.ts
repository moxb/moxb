import { action, observable } from 'mobx';
import { Modal, ModalActions } from './Modal';

export interface ModalOptions<T, A> {
    header?(data: T): string;
    actions(data: T): A;
    onOpen?(): void;
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

        if (this.impl.onOpen) {
            this.impl.onOpen();
        }

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
        const actions = this.impl.actions(this.data);
        // TODO backward compatibility hack -- remove later
        if (Array.isArray(actions)) {
            return {
                cancel: actions[0],
                confirm: actions[1],
            } as any;
        }
        return actions;
    }

    get header() {
        if (this.open && this.impl.header) {
            return this.impl.header(this.data);
        }
        return '';
    }
}
