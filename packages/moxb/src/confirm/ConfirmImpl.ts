import { action, observable, makeObservable } from 'mobx';
import { Bind } from '../bind/Bind';
import { t } from '../i18n/i18n';
import { Confirm, ConfirmBase } from './Confirm';

export interface ConfirmBaseOptions<T> {
    cancelButton: Bind;
    content?(data: T | undefined): string;
    header?(data: T | undefined): string;
    cancel?(): void;
}

export interface ConfirmOptions<T> extends ConfirmBaseOptions<T> {
    confirmButton: Bind;
    confirm?(data: T | undefined): void;
}

export class ConfirmBaseImpl<T, C extends ConfirmBaseOptions<T>> implements ConfirmBase<T> {
    open = false;
    protected data: T | undefined = undefined;

    protected readonly impl: C;
    constructor(impl: C) {
        makeObservable<ConfirmBaseImpl<any, any>, 'data'>(this, {
            open: observable,
            data: observable,
            show: action.bound,
            onCancel: action.bound,
        });

        this.impl = impl;
    }

    show(data: T) {
        this.data = data;
        this.open = true;
    }

    onCancel() {
        this.open = false;
        if (this.impl.cancel) {
            this.impl.cancel();
        }
    }

    get cancelButton() {
        return this.impl.cancelButton;
    }

    get content() {
        if (this.impl.content) {
            if (this.open) {
                return this.impl.content(this.data);
            } else {
                return '';
            }
        }
        return t('ConfirmDialog.defaultContent', 'Are you sure?');
    }

    get header() {
        if (this.open && this.impl.header) {
            return this.impl.header(this.data);
        }
        return '';
    }
}

export class ConfirmImpl<T> extends ConfirmBaseImpl<T, ConfirmOptions<T>> implements Confirm<T> {
    constructor(impl: ConfirmOptions<T>) {
        super(impl);

        makeObservable(this, {
            onConfirm: action.bound,
        });
    }

    onConfirm() {
        this.open = false;
        if (this.impl.confirm) {
            this.impl.confirm(this.data);
        }
    }

    get confirmButton() {
        return this.impl.confirmButton;
    }
}
