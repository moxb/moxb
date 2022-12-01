/**
 * Props for configuring an evaluator
 */
export interface CachedEvaluatorProps<Input, Output> {
    /**
     * The name of this evaluator, for debugging
     */
    readonly name?: string;

    /**
     * How do we yield a key from the input data?
     */
    readonly getKey: (input: Input) => string;

    /**
     * The actual function to run
     */
    readonly getValue: (input: Input) => Output;

    /**
     * How long should we cache results?
     *
     * The default value is 300s - 5 min
     */
    readonly normalCacheSeconds?: number;

    /**
     * How long should we cache the error, if there was an exception?
     *
     * The default value is 60s - 1 min
     */
    readonly errorCacheSeconds?: number;

    /**
     * Should this run in debug mode?
     */
    debugMode?: boolean;

    // TODO: Add a parameter to configure cache pruning behavior
    // (when getting a value, we might want to look for other, obsolete value, and expunge them from the cache.)
}

/**
 * A cached evaluator evaluates a function calls, and caches the result for some time
 */
export interface CachedEvaluator<Input, Output> {
    get(input: Input, forceRefresh?: boolean): Output;
}
