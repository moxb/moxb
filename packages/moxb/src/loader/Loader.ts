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
     * you should call this method to wake up the loader and load the initial data.
     */
    init(): void;

    /**
     * Tell this loader to "relax", i.e. don't load anything until the output data is requested again.
     *
     * My default, the loader will be driven by data: if the input changes, it will reload data,
     * even is nobody is interested in the output.
     *
     * When switched to "relaxed" mode, it will only load data when it is requested by reading the output.
     * This will remove it from relaxed mode, and it will start to listen,
     * and it will listen until you tell it to `relax()` again.
     * The idea is that you could use "relax" when you leave the page when this data is relevant,
     * so that you don't waste bandwidth and CPU for keeping unwanted data up to date when common input changes.
     *
     * Please note that "waking up" from the relaxed state is automatically triggered by some UI code
     * checking the output of the loader.
     */
    relax(): void;

    /**
     * An action to refresh the data.
     */
    readonly refresh: Action;

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
     * Should this loader start in relaxed mode?
     *
     * See the `Loader.relax()` method for details.
     */
    initRelaxed?: boolean;

    /**
     * Is this a stable call?
     *
     * That is, can we assume that it always returns the same output
     * for the same input? If yes, we are not going to re-run it, unless the input changes,
     * or we are explicitly directed to do so.
     */
    stable?: boolean;

    /**
     * If we are loading volatile data (i.e. the same input can result in different output),
     * what is the minimum amount of time we should wait before loading a new value as requested by the UI?
     *
     * (The default is 10 seconds.)
     *
     * Please note that this, in itself, doesn't turn on polling; the purpose of this behaviour is simply
     * to avoid loading the same data multiple times just because the UI is requesting it.
     *
     * Please also note that this value is ignored for stable data (see above).
     */
    cacheTime?: number;

    /**
     *  Polling period, in seconds
     *
     *  If set, then we will periodically re-load the data.
     */
    polling?: number;

    /**
     * Any extra function to call after successful loading
     */
    onLoad?: (output: Output) => void;

    /**
     * Should we keep previous data while loading new data?
     *
     * The default is false, which means that while loading data,
     * value will temporarily switch to undefined.
     */
    keepPreviousData?: boolean;

    /**
     * Should we keep previous data when (based on the input) we are skipping the loading?
     *
     * The default is false, which means then if the loading is skipped,
     * value will be undefined.
     */
    keepDataWhenSkipping?: boolean;

    /**
     * Should we run in debug mode?
     */
    debug?: boolean;
}
