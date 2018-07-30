/**
 * @param D The data that is returned by meteor
 */
export interface DataFetcher<D extends object> {
    readonly data: D;
    /**
     * null or undefined if no error is present
     */
    readonly error: any;
    /**
     * while loading data or before any data is loaded, this is false
     */
    readonly dataReady: boolean;
}
