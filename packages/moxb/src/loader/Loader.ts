import { Action } from '../action/Action';

/**
 * A `Loader` can follow the changes in some input data, and prepare some output data accordingly.
 *
 * Let's assume that there is a value ("output") that depends on some other value ("input"),
 * and can be derived from it using an asynchronous function.
 *
 * One example would be loading some data from an external source, based on an ID or other criteria.
 *
 * A `Loader` can do this for you: it watches the input, and maintains the output accordingly.
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
     * An action to (re)load the data
     */
    readonly fetch: Action;

    /**
     * Insert data
     *
     * In special circumstances, you might want to directly override the loaded value.
     * Use this sparingly.
     */
    setValue(value: Output): void;
}

/**
 * Configuration for a Loader
 */
export interface LoaderOptions<Input, Output> {
    /**
     * ID for debugging
     */
    id: string;

    /**
     * How do I get the input?
     *
     * This should use mobx-observable data sources.
     */
    getInput: () => Input | undefined;

    /**
     * How do I know if we need to skip loading for this input?
     *
     * Please note that even if not given, we won't load the output
     * when the input is undefined.
     */
    skipIf?: (input?: Input) => boolean;

    /**
     * How do I load the data?
     */
    load: (input: Input) => Promise<Output>;

    /**
     * Any extra function to call after successful loading
     */
    onLoad?: (output: Output) => void;

    /**
     * Should we run in debug mode?
     */
    debug?: boolean;
}
