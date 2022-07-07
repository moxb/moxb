import { action, makeObservable, observable, reaction } from 'mobx';
import { Loader } from './Loader';
import { getDebugLogger, Logger } from '../util/debugLog';

/**
 * Configuration for a loader
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
export class LoaderImpl<Input, Output> implements Loader<Input, Output> {
    private readonly _logger: Logger;

    constructor(private readonly _options: LoaderOptions<Input, Output>) {
        const { debug, id } = _options;
        this._logger = getDebugLogger('Data loader ' + id, debug);
        makeObservable(this);
    }

    /**
     * Reload data
     */
    trigger() {
        this._logger.log('Triggered. Input is:', this.input);
        this.setValue(undefined);
        this._setErrorMessage(undefined);
        if (this.input !== undefined && !this._shouldSkip) {
            this._logger.log('Will load');
            this._setLoading(true);
            this._options.load(this.input).then(
                (result) => {
                    this._logger.log('Loaded', result);
                    this._setLoading(false);
                    this.setValue(result);
                    const { onLoad } = this._options;
                    if (onLoad) {
                        onLoad(result);
                    }
                },
                (error) => {
                    this._logger.log('Failed to load:', error);
                    this._setLoading(false);
                    this._setErrorMessage(error.reason || error.error || error + '');
                }
            );
        } else {
            this._logger.log('Will NOT load');
        }
    }

    /**
     * Start to listen
     */
    awaken() {
        reaction(
            () => this.input,
            () => this.trigger()
        );
    }

    /**
     * Get the current input
     */
    get input() {
        return this._options.getInput();
    }

    /**
     * Find out if we should skip loading
     */
    private get _shouldSkip() {
        const { skipIf = () => false } = this._options;
        return skipIf(this.input);
    }

    /**
     * Internal data store for the loading flag
     */
    @observable
    _loading = false;

    /**
     * Are we loading now?
     */
    get loading() {
        return this._loading;
    }

    /**
     * Set the loading flag
     */
    @action
    private _setLoading(value: boolean) {
        this._loading = value;
    }

    /**
     * Internal store for the error message
     */
    @observable
    _errorMessage?: string;

    get errorMessage() {
        return this._errorMessage;
    }

    @action
    private _setErrorMessage(message?: string) {
        this._errorMessage = message;
    }

    @observable
    _value?: Output;

    /**
     * Return the value
     */
    get value() {
        return this._value;
    }

    @action
    setValue(value?: Output) {
        this._value = value;
    }
}
