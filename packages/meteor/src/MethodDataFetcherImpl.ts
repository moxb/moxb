import { action, autorun, computed, IReactionDisposer, observable, onBecomeObserved, onBecomeUnobserved } from 'mobx';
import { MeteorDataFetcher, MeteorDataFetcherDone, MeteorDataFetcherFunction } from './MeteorDataFetcher';

/**
 * If canceled the done function is not called (the result of the request is ignored)
 */
class CancelableDone<D> {
    private canceled = false;
    constructor(private readonly doneFunc: MeteorDataFetcherDone<D>) {}
    done = (err: any, data: D | undefined) => {
        if (!this.canceled) {
            // call the done function ONLY if the request is not cancelled!
            this.doneFunc(err, data);
        }
    };
    cancel() {
        this.canceled = true;
    }
}

/**
 * We want to deal with multiple outstanding requests. If a new request is made, we want to make
 * sure that the result of an already running request is ignored. The way to do this: each
 * request gets an cancelable done function. When a new request comes in (or the component becomes
 * unobserved) the currently running request is canceled.
 *
 * When a request is cancelled, the `done` method does nothing.
 */
export abstract class MethodDataFetcherImpl<Q, D extends Object> implements MeteorDataFetcher<Q, D> {
    private autorunDisposer!: IReactionDisposer;
    private dataFetcherFunction: MeteorDataFetcherFunction<D> | undefined;
    @observable
    private _data: D;
    @observable
    private _error: any;

    // we start with not ready, because the data has to be loaded at least once.
    @observable
    _dataReady = false;
    private currentRequestDone: CancelableDone<D> | undefined;

    constructor() {
        this._data = this.getInitialData();
    }

    get dataReady() {
        return this._dataReady;
    }
    @computed
    get data() {
        return this.getData();
    }

    protected getData() {
        return this._data;
    }

    get error() {
        return this._error;
    }

    @action.bound
    private clearAllData() {
        this.cancelCurrentRequest();
        this._dataReady = false;
        this._data = this.getInitialData();
        this._error = undefined;
    }

    private cancelCurrentRequest() {
        if (this.currentRequestDone) {
            this.currentRequestDone.cancel();
        }
        this.currentRequestDone = undefined;
    }

    setDataFetcher(func: MeteorDataFetcherFunction<D>) {
        if (this.dataFetcherFunction) {
            throw new Error('setDataFetcher can only be called once');
        }
        this.dataFetcherFunction = func;
        onBecomeObserved(this, '_data', () => {
            // it's important to get the autorunDisposer here...
            this.autorunDisposer = autorun(() => this.runDataFetcherFunction());
        });
        onBecomeUnobserved(this, '_data', () => {
            this.clearAllData();
            // we stop the auto update, since nobody is listening....
            this.autorunDisposer();
        });
    }

    // this is not an action! If it would be an action, then it would not be reactive!
    private runDataFetcherFunction() {
        if (!this.dataFetcherFunction) {
            throw new Error('setDataFetcher was not called!');
        }
        this.cancelCurrentRequest();
        this._dataReady = false;
        this.currentRequestDone = new CancelableDone<D>(this.done);
        this.dataFetcherFunction(this.currentRequestDone.done);
    }

    /**
     * The callback that sets the data or the error.
     * @param err
     * @param data
     */
    @action.bound
    private done(err: any, data: D | undefined) {
        // this is the callback
        this._error = err;
        // no data, therefore we reset the data to the initial data!
        if (data === undefined) {
            data = this.getInitialData();
        }
        this._data = data;
        this._dataReady = true;
    }

    abstract callFetchData(query: Q, done: MeteorDataFetcherDone<D>): void;

    /**
     * Must return a fresh copy of the initial _data. This is the _data to be shown before any _data is loades.
     * The method must always return the same _data.
     * @returns {D}
     */
    abstract getInitialData(): D;
}
