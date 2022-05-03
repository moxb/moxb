/**
 * A classical callback function that either returns an error or the data.
 */
export type MeteorDataFetcherDone<D> = (error: any, data: D | undefined) => void;
/**
 * This must be called when
 */
export type MeteorDataFetcherFunction<D> = (done: MeteorDataFetcherDone<D>) => void;

/**
 * @param Q the data to query the method
 * @param D The data that is returned by meteor
 */
export interface MeteorDataFetcher<Q, D> {
    readonly data: D;
    /**
     * null or undefined if no error is present
     */
    readonly error: any;
    /**
     * while loading data or before any data is loaded, this is false
     */
    readonly dataReady: boolean;

    /**
     * Register a function that is (MobX) observed for changes. It should set the fields of this object.
     * The update can happen sync or async!
     * @param {Function} func that calls getData at some point
     */
    setDataFetcher(func: MeteorDataFetcherFunction<D>): void;

    /**
     * This method is reactively called
     * @param {Q} query
     * @param done must be called when the request is done.
     */
    callFetchData(query: Q, done: MeteorDataFetcherDone<D>): void;

    /**
     * This method should indicate if our data become "dirty"
     */
    invalidateData(): void;
}
