import { ErrorMessage } from './ErrorMessage';

export type FieldErrorMessages = { [field: string]: ErrorMessage };

/**
 * Handles simple Schema Validation errors.
 */
export interface SimpleSchemaValidation {
    /**
     * All errors of the validation --
     */
    readonly errorsDetails: FieldErrorMessages;

    /**
     * Get error for specified field or fieldPath
     * @param {string} field path th the field
     * @returns {string | undefined} error if available
     */
    errorMessage(field: string): string | undefined;

    /**
     * Get an error Label for the field (containing the field name plus an error message)
     * @param {string} field
     * @param {string} label
     * @returns {string}
     */
    errorLabel(field: string, label: string): string;

    /**
     * Has any error.
     */
    readonly hasErrors: boolean;
}
