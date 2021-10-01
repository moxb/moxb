import { Bind } from '../bind/Bind';
import { ConfirmBase } from './Confirm';

/**
 * This is an extension of the confirm dialog
 * by allowing to select from a list of confirm buttons
 */
export interface SelectableConfirm<T> extends ConfirmBase<T> {
    /**
     * Uses Bind to setup enablement and label etc
     */
    confirmButtons: Bind[];

    /**
     * Called by the UI when the dialog is confirmed
     */
    onConfirm(index: number): void;
}
