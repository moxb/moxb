import { UrlArg } from '../url-arg/UrlArg';

import { Query } from '../url-schema/UrlSchema';

/**
 * Information about a planned change in the URl arguments
 */
export type QueryChange = {
    key: string;
    value: string | undefined;
};

/**
 * The possible methods for updating the location, in relation to the history.
 */
export type UpdateMethod = 'push' | 'replace';

/**
 * The Location Manager is responsible for tracking the location (ie. URL) of the application,
 * and abstract away the interface by providing separate path tokens and URL arguments.
 */
export interface LocationManager {
    /**
     * These flags describe whether the current location should be
     * considered stable, or it's temporary in the sense that we are
     * in the middle of an operation that will generate another
     * change very soon.
     * */
    final: boolean;

    /**
     * This flag is the opposite of the final flag. You can read or write any of them.
     */
    temporary: boolean;

    /**
     * path tokens for the current location
     */
    readonly pathTokens: string[];

    /**
     * Determine whether a given token at a given level matches
     *
     * @param tokens The tokens to test against the current location
     * @param level The level where the token should be found
     * @param exactOnly Is it a match only if there are no further tokens?
     */
    doPathTokensMatch: (token: string[], level: number, exactOnly: boolean, debugMode?: boolean) => boolean;

    /**
     * Determine the URL that we would get if we pushed these path tokens.
     *
     * @param position Where to push the tokens? (How many levels to retain?)
     * @param tokens The tokens to push
     */
    getURLForPathTokens: (position: number, tokens: string[]) => string;

    /**
     * Set the last few path tokens.
     *
     * @param position Where to push the tokens? (Any tokens before this will be preserved.)
     * @param tokens The tokens to push.
     * @param method The method to use for updating the URL.
     */
    setPathTokens: (position: number, tokens: string[], method?: UpdateMethod) => void;

    /**
     * the search queries for the current location
     */
    readonly query: Query;

    /**
     * Determine the URL that we would get if we changed some URL arguments
     *
     * @param changes The changes to calculate
     */
    getURLForQueryChanges: (changes: QueryChange[]) => string;

    /**
     * Set some query variables
     *
     * @param changes The changes to execute
     * @param method The method to use for updating the URL.
     */
    setQueries: (changes: QueryChange[], method?: UpdateMethod) => void;

    /**
     * Determine the URL that we would get if we changed an URL argument
     *
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     */
    getURLForQueryChange: (key: string, rawValue: string | undefined) => string;

    // Set a single query variable
    /**
     * Set a query variable
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     * @param method The method to use for updating the URL.
     */
    setQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod) => void;

    /**
     * Register a permanent URl argument.
     */
    registerUrlArg: (arg: UrlArg<any>) => void;
}

/**
 * The interface we use when injecting the Location Manager
 */
export interface UsesLocation {
    locationManager?: LocationManager;
}
