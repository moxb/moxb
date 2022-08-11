import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { Loader, LoaderOptions } from './Loader';
import { getDebugLogger, Logger } from '../util/debugLog';
import { ActionImpl } from '../action/ActionImpl';

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
export class LoaderImpl<Input, Output> implements Loader<Input, Output> {
    private readonly _logger: Logger;

    constructor(private readonly _options: LoaderOptions<Input, Output>) {
        const { debug, id } = _options;
        this._logger = getDebugLogger('Data loader ' + id, debug);
        makeObservable(this);
    }

    /**
     * Load data
     */
    readonly fetch = new ActionImpl({
        id: 'loaderAction',
        fire: (): Promise<any> | undefined => {
            this._logger.log('Load fired. Input is:', this.input);
            this.setValue(undefined);
            if (this.input !== undefined && !this._shouldSkip) {
                this._logger.log('Will load');
                const loadPromise = this._options.load(this.input);
                loadPromise.then(
                    (result) => {
                        this._logger.log('Loaded', result);
                        this.setValue(result);
                        const { onLoad } = this._options;
                        if (onLoad) {
                            onLoad(result);
                        }
                    },
                    (error) => {
                        this._logger.log('Failed to load:', error);
                    }
                );
                return loadPromise;
            } else {
                this._logger.log('Will NOT load');
            }
        },
    });

    /**
     * Start to listen
     */
    awaken() {
        reaction(
            () => this.input,
            () => this.fetch.fire()
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
     * Are we loading now?
     */
    @computed
    get loading() {
        return this.fetch.pending;
    }

    @computed
    get errorMessage() {
        return this.fetch.errorMessage;
    }

    @observable
    _value?: Output;

    /**
     * Return the value
     */
    @computed
    get value() {
        return this._value;
    }

    @action
    setValue(value?: Output) {
        this._value = value;
    }
}
