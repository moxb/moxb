import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { Loader, LoaderOptions } from './Loader';
import { getDebugLogger, Logger } from '../util/debugLog';
import { ActionImpl } from '../action/ActionImpl';
import { isUndefined } from 'lodash';
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
export class LoaderImpl<Input, Output> implements Loader<Input, Output> {
    private readonly _logger: Logger;

    constructor(private readonly _options: LoaderOptions<Input, Output>) {
        const { debug, id } = _options;
        this._logger = getDebugLogger('Data loader ' + id, debug);
        makeObservable(this);
    }

    /**
     * The last input value that we have seen
     *
     * ... and fetched data for, or decide to skip
     */
    private _fetchedForInput?: Input;
    private _checkedAt?: number;

    private get __hasInputChanged(): boolean {
        return JSON.stringify(this.input) !== JSON.stringify(this._fetchedForInput);
    }

    private get _cacheTime() {
        return (this._options.cacheTime || 10) * 1000;
    }

    private get _areWeUpToDate(): boolean {
        if (isUndefined(this._checkedAt)) {
            return false;
        }
        if (this.__hasInputChanged) {
            return false;
        }
        if (this._options.stable) {
            return true;
        } else {
            const age = Date.now() - this._checkedAt;
            return age <= this._cacheTime;
        }
    }

    private _relaxing = false;

    /**
     * Relax, stop following changes
     */
    relax() {
        this._logger.log('Relaxing.');
        this._relaxing = true;
    }

    private _tick() {
        delete this._timer;
        this.refresh.fire();
    }

    private _clearSchedule() {
        if (this._timer) {
            clearTimeout(this._timer);
            delete this._timer;
        }
    }

    private _scheduleNext() {
        if (this._options.polling) {
            this._clearSchedule();
            this._timer = setTimeout(() => this._tick(), this._options.polling * 1000);
        }
    }

    /**
     * Internal loader wrapping the loading
     * @private
     */
    private readonly _load: Action = new ActionImpl({
        id: 'internalLoader',
        fire: () => {
            const input = this.input;
            this._fetchedForInput = input;
            this._checkedAt = Date.now();
            if (isUndefined(input) || this._shouldSkip) {
                if (!this._options.keepDataWhenSkipping) {
                    this.setValue(undefined);
                }
                return Promise.resolve('Based on the input, SKIPPING this.');
            }
            this._logger.log('Loading data for input', input);
            if (!this._options.keepPreviousData) {
                this.setValue(undefined);
            }
            const loadPromise = this._options.load(input);
            loadPromise.then(
                (result) => {
                    this._logger.log('Loaded', result);
                    this.setValue(result);
                    const { onLoad } = this._options;
                    if (onLoad) {
                        onLoad(result);
                    }
                    this._scheduleNext();
                },
                (error) => {
                    this._logger.log('Failed to load:', error);
                    this._scheduleNext();
                }
            );
            return loadPromise;
        },
    });

    private _fetchIfWeHaveTo(): Promise<string | void> {
        if (this._sleeping) {
            this._logger.log('Sleeping, not fetching.');
            return Promise.resolve('Sleeping, not fetching.');
        }
        if (this._relaxing) {
            return Promise.resolve('Relaxing, not fetching.');
        }
        if (this._areWeUpToDate) {
            return Promise.resolve('We are up to date already, not fetching.');
        }
        if (this._load.pending) {
            console.log('Oops trying to call fetch while already pending on', this._options.id);
            return Promise.resolve('Already loading'); // TODO: make sure that we will reload later
        }
        return this._load.firePromise();
    }

    /**
     * Make sure that we are up-to-date!
     *
     *      * ... unless we are sleeping. If we are sleeping, do nothing.
     */
    private _update() {
        if (this._sleeping) {
            return;
        }
        if (this._relaxing) {
            this._relaxing = false;
            this._logger.log('Stop relaxing!');
        }
        void this._fetchIfWeHaveTo();
    }

    readonly refresh = new ActionImpl({
        id: 'loaderActionRefresh',
        fire: () => {
            this._logger.log('Invalidating data');
            this._fetchedForInput = undefined;
            this._checkedAt = undefined;
            return this._fetchIfWeHaveTo();
        },
    });

    private _sleeping = true;

    private _timer: NodeJS.Timeout | undefined;

    /**
     * Start to listen
     */
    init() {
        if (!this._sleeping) {
            this._logger.log('Not awakening, not sleeping.');
            return;
        }
        this._sleeping = false;
        this._logger.log('Awakening. Relaxed?', !!this._options.initRelaxed);
        if (this._options.initRelaxed) {
            this.relax();
        }
        void this._fetchIfWeHaveTo();
        reaction(
            () => this.input,
            () => this._fetchIfWeHaveTo()
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
    get loading() {
        this._update();
        return this._load.pending;
    }

    @computed
    get errorMessage() {
        return this._load.errorMessage;
    }

    @observable
    _value?: Output;

    /**
     * Return the value
     */
    get value() {
        this._update();
        return this._value;
    }

    @action
    setValue(value?: Output) {
        this._value = value;
    }
}
