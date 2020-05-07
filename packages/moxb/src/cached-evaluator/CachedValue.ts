/**
 * Props for configuring a cached value
 */
export interface CachedValueProps<Output> {
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
     * It is allowed to throw an exception. (Which will also be cached.)
     */
    readonly getValue: () => Output;

    /**
     * How long should we cache results?
     *
     * Default value is 300 secs - 5 minutes
     */
    readonly normalCacheSeconds?: number;

    /**
     * How long should we cache the error, if there was an exception?
     *
     * When we are holding the cached exception, it will be thrown again and again,
     * every time get() is called, until the next refresh.
     *
     * Default value is 60 secs - 1 minute
     */
    readonly errorCacheSeconds?: number;

    /**
     * Should this run in debug mode?
     */
    debugMode?: boolean;
}

/**
 * A CachedValue instance holds a cached value.
 *
 * You can call `get()` to get the value, or `get(true)` to force a refresh.
 * When refreshing, the value is calculated by the user-supplied getter function.
 * Even if you don't force a refresh, the value will be refreshed from time to time,
 * depending on the parameters used when initializing the CachedValue store.
 * If the getter function fails (and throws an exception), then this behavior is cached
 * and repeated by subsequent get() calls, until it's time to refresh again.
 */
export interface CachedValue<Output> {
    get(forceRefresh?: boolean): Output;
}
