import { Bind } from '../bind/Bind';

/**
 * This is a representation of the Confirm dialog:
 * https://react.semantic-ui.com/addons/confirm
 */
export interface Confirm<T> {
    /**
     * is the dialog currently shown?
     */
    open: boolean;

    /**
     * Uses Bind to setup enablement and label etc
     */
    cancelButton: Bind;

    /**
     * Uses Bind to setup enablement and label etc
     */
    confirmButton: Bind;

    /**
     * The message content
     */
    content: string;

    /**
     * If not falsely shown as Header of the dialog
     */
    header?: string;

    /**
     * Show the dialog with a given value. The implementation uses the value on confirm
     * @param {T} value
     */
    show(value?: T): void;

    /**
     * Called by the UI when the dialog is cancelled
     */
    onCancel(): void;

    /**
     * Called by the UI when the dialog is confirmed
     */
    onConfirm(): void;
}
