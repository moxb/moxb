import { Bind } from '../bind/Bind';

/**
 * This is a representation of the Confirm dialog:
 * https://react.semantic-ui.com/addons/confirm
 */

export interface ConfirmBase<T> {
    /**
     * is the dialog currently shown?
     */
    open: boolean;

    /**
     * Uses Bind to setup enablement and label etc
     */
    cancelButton: Bind;

    /**
     * The message content
     */
    content: string;

    /**
     * If not falsely shown as Header of the dialog
     */
    header?: string;

    /**
     * Called by the UI when the dialog is cancelled
     */
    onCancel(): void;

    /**
     * Show the dialog with a given value. The implementation uses the value on confirm
     * @param {T} value
     */
    show(value?: T): void;
}

export interface Confirm<T> extends ConfirmBase<T> {
    /**
     * Uses Bind to setup enablement and label etc
     */
    confirmButton: Bind;

    /**
     * Called by the UI when the dialog is confirmed
     */
    onConfirm(): void;
}
