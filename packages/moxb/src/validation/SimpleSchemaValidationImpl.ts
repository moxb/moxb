import { computed } from 'mobx';
import { t } from '../i18n/i18n';
import { ErrorMessage, extractErrorMessages } from './ErrorMessage';
import { FieldErrorMessages, SimpleSchemaValidation } from './SimpleSchemaValidation';

export class SimpleSchemaValidationImpl implements SimpleSchemaValidation {
    /**
     * options.ignoreEmptyFields is a list of field names that do not report error if the field is empty.
     * However, the error is in the list of errors and hasErrors returns true...
     * @param {string} id
     * @param {() => (Error | undefined)} getValidationErrors
     * @param {{ignoreEmptyFields:string[]}} options
     */
    constructor(
        private readonly id: string,
        private readonly getValidationErrors: () => Error | undefined,
        private readonly options?: { ignoreEmptyFields: string[] }
    ) {}

    @computed
    get errorsDetails(): FieldErrorMessages {
        const errors: FieldErrorMessages = {};
        const error = this.getValidationErrors();
        if (error) {
            extractErrorMessages(error)
                .filter((e) => !!e.fieldName)
                .forEach((err) => (errors[err.fieldName || ''] = err));
        }
        return errors;
    }

    /**
     * Checks if the value is empty and
     * @param {ErrorMessage} e
     * @returns {boolean}
     */
    private isIgnoreErrorBecauseFieldIsEmpty(e: ErrorMessage) {
        if (!this.options || !this.options.ignoreEmptyFields || !e) {
            return false;
        }
        if (e.fieldName && this.options.ignoreEmptyFields.indexOf(e.fieldName)) {
            return !e.value;
        }
        return false;
    }

    private getError(field: string) {
        const errorDetail = this.errorsDetails[field];
        if (this.isIgnoreErrorBecauseFieldIsEmpty(errorDetail)) {
            return undefined;
        }
        return errorDetail;
    }

    public errorMessage(field: string) {
        const errorDetail = this.getError(field);
        if (errorDetail) {
            return errorDetail.message;
        }
        return undefined;
    }

    public errorLabel(field: string, label: string) {
        const errorDetail = this.getError(field);
        if (!errorDetail) {
            return t(`${this.id}.${field}.label`, label);
        } else {
            return t(`${this.id}.${field}.error.${errorDetail.key}.${label}`, `${label} (${errorDetail.message})`);
        }
    }

    @computed
    get hasErrors() {
        return Object.keys(this.errorsDetails).length !== 0;
    }
}
