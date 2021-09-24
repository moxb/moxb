/**
 * Interface for dealing with file uploads
 */
import { Label } from '../label/Label';
import { Action } from '../action/Action';

export interface FileUpload {
    /**
     * Label to display (in a form)
     */
    readonly label?: string;

    /**
     * Help to display (in a form)
     */
    readonly help?: string;

    /**
     * The message title that should be displayed
     */
    readonly promptTitle?: string;

    /**
     * The message that should be displayed
     */
    readonly prompt: string;

    /**
     * Should this be visible?
     */
    readonly visible: boolean;

    /**
     * Should this be invisible?
     */
    readonly invisible: boolean;

    /**
     * Are we uploading data right now?
     */
    readonly pending: boolean;

    /**
     * Do we have the data?
     */
    readonly succeeded: boolean;

    /**
     * The name of the uploaded file
     *
     * Will return undefined if no file has been uploaded.
     */
    readonly fileName: string | undefined;

    /**
     * The uploaded data in a string format
     *
     * Will return undefined if no file has been uploaded.
     */
    readonly dataAsString: string | undefined;

    /**
     * The uploaded data in binary format
     *
     * Will return undefined if no file has been uploaded.
     */
    readonly dataAsBinary: ArrayBuffer | undefined;

    /**
     * Have we failed?
     */
    readonly failed: boolean;

    /**
     * Any error message
     */
    readonly errorMessage: string | undefined;

    /**
     * A label for error message
     */
    readonly errorLabel: Label;

    /**
     * A label for indicating a successful upload
     */
    readonly successLabel: Label;

    /**
     * Info about the upload progress.
     *
     * The value moves between [0, 1]
     */
    readonly progress: number;

    /**
     * A label for indicating progress
     */
    readonly progressLabel: Label;

    /**
     * Is multiple file upload allowed?
     */
    readonly multiple: boolean;

    /**
     * Drop the previously uploaded file
     */
    reset(): void;

    /**
     * Drop the previously uploaded file
     */
    readonly resetAction: Action;

    /**
     * Upload a new file
     */
    upload(file: File | File[]): void;

    /**
     * File extensions to allow, if not set everything is allowed.
     * Example: ['.mp3', '.png']
     */
    readonly allowedFileExtensions?: string[];

    /**
     * File types to allow, if not set everything is allowed
     */
    readonly allowedFileTypes?: string[];

    /**
     * Set an error message to display when file checking before upload fails
     */
    setErrorCheckMessage(error: string): void;
}
