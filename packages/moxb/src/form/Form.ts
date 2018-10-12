import { Bind } from '..';

export interface Form extends Bind {
    /**
     * Is it currently possible to submit the form?
     */
    canSubmitForm: boolean;

    /**
     * Has the form currently any validation errors
     */
    hasErrors: boolean;

    /**
     * Contains the list of tracked errors by the children components
     */
    allErrors: string[];

    /**
     * The form submits and triggers in all components the save method, which also could cause errors from server methods.
     * @param {any} evt, The event type is <any> because different ui libraries can cast the original event differently.
     */
    onSubmitForm(evt?: any): void;

    /**
     * Clear all validation errors from the children components
     */
    clearAllErrors(): void;

    /**
     * Reset all the values to the initial value for the child components
     */
    resetValues(): void;
}
