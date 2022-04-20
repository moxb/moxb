import { action, observable, makeObservable } from 'mobx';
import { Modal, ModalActions } from './Modal';

export interface ModalOptions<T, A> {
    header?(data: T | undefined): string;
    actions(data: T | undefined): A;
    onOpen?(): void;
    onClose?(): void;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
}

export class ModalImpl<T, A extends ModalActions = ModalActions> implements Modal<T, A> {
    open = false;
    data: T | undefined = undefined;
    private readonly impl: ModalOptions<T, A>;

    constructor(impl: ModalOptions<T, A>) {
        makeObservable(this, {
            open: observable,
            data: observable,
            show: action.bound,
            onClose: action.bound,
        });

        this.impl = impl;
    }

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
