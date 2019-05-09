import { Action } from '../action/Action';

export interface ModalActions {
    cancel: Action;
    confirm?: Action;
}

/**
 * This is a representation of the Modal dialog:
 * https://react.semantic-ui.com/modules/modal
 */
export interface Modal<T, A extends ModalActions = ModalActions> {
    /**
     * The data that is associated with the dialog
     */
    readonly data: T;
    /**
     * is the dialog currently shown?
     */
    readonly open: boolean;

    /**
     * Actions define the user action which be placed in Modal.Action, typically an array of BindActions.
     * The first action must be the cancel action, the second action (if any) must be the confirm action.
     */
    readonly actions: A;

    /**
     * If not falsely shown as Header of the dialog
     */
    readonly header?: string;

    /**
     * Show the dialog with a given value. The implementation uses the value on confirm
     * @param {T} value
     */
    show(value?: T): void;

    /**
     * Call to close the dialog
     */
    close(): void;

    /**
     * Called by the UI when the dialog is opened
     */
    onOpen?(): void;

    /**
     * Called by the UI when the dialog is closed
     */
    onClose(): void;

    /**
     * Change the modal size by setting the size prop
     */
    readonly size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
}
