import { Bind } from '../bind/Bind';
import { ConfirmBaseOptions, ConfirmBaseImpl } from './ConfirmImpl';
import { SelectableConfirm } from './SelectableConfirm';
import { action } from 'mobx';

export interface SelectableConfirmOptions<T> extends ConfirmBaseOptions<T> {
    confirmButtons: Bind[];
    confirm?(data: T, index: number): void;
}

export class SelectableConfirmImpl<T>
    extends ConfirmBaseImpl<T, SelectableConfirmOptions<T>>
    implements SelectableConfirm<T> {
    constructor(impl: SelectableConfirmOptions<T>) {
        super(impl);
    }

    @action.bound
    onConfirm(index: number) {
        this.open = false;
        if (this.impl.confirm) {
            this.impl.confirm(this.data, index);
        }
    }

    get confirmButtons() {
        return this.impl.confirmButtons;
    }
}
