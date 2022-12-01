/**
 * Props for configuring a cached value
 */
export interface CachedOptionalValueProps<Output> {
    /**
     * The name of this value.
     *
     * Used for debugging.
     */
    readonly name?: string;

    /**
     * The actual function to run
     *
     * This function is executed when we need a fresh value.
     * In case of a failure, it is supposed to return undefined.
     * (Which will also be cached.)
     */
    readonly getValue: () => Output | undefined;

    /**
     * How long should we cache results?
     *
     * The default value is 300s - 5 min
     */
    readonly normalCacheSeconds?: number;

    /**
     * How long should we cache the undefined result?
     *
     * When we are holding the undefined result, it will be returned again and again,
     * every time get() is called, until the next refresh.
     *
     * The default value is 60s - 1 min
     */
    readonly errorCacheSeconds?: number;

    /**
     * Should this run in debug mode?
     */
    debugMode?: boolean;
}

/**
 * A CachedOptionalValue instance holds a cached value, which is optional. (Ie it can also be undefined.)
 *
 * You can call `get()` to get the value, or `get(true)` to force a refresh.
 * When refreshing, the value is calculated by the user-supplied getter function.
 * Even if you don't force a refresh, the value will be refreshed from time to time,
 * depending on the parameters used when initializing the CachedValue store.
 * If the getter function fails (and returns undefined), then this behavior is cached
 * and repeated by subsequent get() calls, until it's time to refresh again.
 */
export interface CachedOptionalValue<Output> {
    get(forceRefresh?: boolean): Output | undefined;
}
