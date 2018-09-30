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
     */
    onSubmitForm(): void;

    /**
     * Clear all validation errors from the children components
     */
    clearAllErrors(): void;
}
