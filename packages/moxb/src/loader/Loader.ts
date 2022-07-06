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
     *
     * The loader won't automatically start to watch the input upon creation.
     * This is necessary because in some cases, the dependencies are not there yet.
     *
     * So when everything is ready (most likely, in the constructor of your class using the loader),
     * you should call this method to wake up the loader.
     */
    awaken(): void;

    /**
     * Trigger re-loading
     *
     * By default, we only reload the data when the input changes.
     * But there can be case when a manual update might be desired.
     * In that situation, call this method.
     */
    trigger(): void;

    /**
     * Insert data
     *
     * In special circumstances, you might want to directly override the loaded value.
     * Use this sparingly.
     */
    setValue(value: Output): void;
}
