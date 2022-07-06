/**
 * A loader can follow some input, and always load some output accordingly
 *
 * Let's assume that there is a value ("output") that depends on
 * some other value ("input"), and can be derived from it using
 * an asynchronous function.
 *
 * One example would be loading some data from an external source,
 * based on some ID or other criteria.
 *
 * A Loader can do this for you: watch the input, and maintain the output
 * accordingly.
 */
export interface Loader<Input, Output> {
    /**
     * What is the current input we are looking at?
     */
    readonly input?: Input;

    /**
     * Are we currently loading?
     */
    readonly loading: boolean;

    /**
     * Error message to display (if any)
     */
    readonly errorMessage?: string;

    /**
     * The current output (if any)
     */
    readonly value?: Output;

    /**
     * Start listening
     */
    awaken(): void;
}
