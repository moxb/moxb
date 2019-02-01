import { UrlArg } from '../url-arg';

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
export enum UpdateMethod {
    NONE = 'none', // Don't set the location at all
    PUSH = 'push', // Push a new element to the history
    REPLACE = 'replace', // Replace the current element of history
}

export interface Redirect {
    // Where should we jump from?
    fromTokens: string[];

    // Is there a condition that must be checked before jumping?
    condition?: () => boolean;

    // Jump only if there are no more tokens? (default: false)
    root?: boolean;

    // Where should we jump to?
    toTokens: string[];

    // Should we copy any remaining tokens to the new path? (default: false)
    copy?: boolean;
}

export interface TestLocation {
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
     * the search queries for the current location
     */
    readonly query: Query;
}

/**
 * The interface a component that is interested in messing with location changes
 * must implement.
 */
export interface LocationUser {
    tryLocation(location: TestLocation): string[];
}

/**
 * The Location Manager is responsible for tracking the location (ie. URL) of the application,
 * and abstract away the interface by providing separate path tokens and URL arguments.
 */
export interface LocationManager {
    /**
     * Register a component that is interested in the location.
     */
    registerUser: (user: LocationUser) => void;

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
     * @param tokens The tokens to set.
     * @param method The method to use for updating the URL.
     */
    doSetPathTokens: (position: number, tokens: string[], method?: UpdateMethod) => void;

    /**
     * Try to set the last few path tokens.
     *
     * @param position Where to push the tokens? (Any tokens before this will be preserved.)
     * @param tokens The tokens to set.
     * @param method The method to use for updating the URL.
     */
    trySetPathTokens: (position: number, tokens: string[], method?: UpdateMethod) => Promise<boolean>;

    /**
     * Appends a set of tokens to the current path
     *
     * @param tokens The tokens to append.
     * @param method The method to use for updating the URL.
     */
    doAppendPathTokens: (tokens: string[], method?: UpdateMethod) => void;

    /**
     * Removes the given number of path tokens from the current path.
     */
    doRemovePathTokens: (count: number, method?: UpdateMethod) => void;

    /**
     * Tries to appends a set of tokens to the current path
     *
     * @param tokens The tokens to append.
     * @param method The method to use for updating the URL.
     */
    tryAppendPathTokens: (tokens: string[], method?: UpdateMethod) => Promise<boolean>;

    /**
     * Removes the given number of path tokens from the current path.
     */
    tryRemovePathTokens: (count: number, method?: UpdateMethod) => Promise<boolean>;

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
     * @param changes The query changes to execute
     * @param method The method to use for updating the URL.
     */
    doSetQueries: (changes: QueryChange[], method?: UpdateMethod) => void;

    /**
     * Try to set some query variables
     *
     * @param changes The changes to execute
     * @param method The method to use for updating the URL.
     */
    trySetQueries: (changes: QueryChange[], method?: UpdateMethod) => Promise<boolean>;

    /**
     * Set the last few path tokens, and also some queries
     *
     * @param position Where to push the tokens? (Any tokens before this will be preserved.)
     * @param tokens The tokens to set.
     * @param changes The query changes to execute*
     * @param method The method to use for updating the URL.
     */
    doSetPathTokensAndQueries: (
        position: number,
        tokens: string[] | undefined,
        changes: QueryChange[] | undefined,
        method?: UpdateMethod
    ) => void;

    /**
     * Set the last few path tokens, and also some queries
     *
     * @param position Where to push the tokens? (Any tokens before this will be preserved.)
     * @param tokens The tokens to set.
     * @param changes The query changes to execute*
     * @param method The method to use for updating the URL.
     */
    trySetPathTokensAndQueries: (
        position: number,
        tokens: string[] | undefined,
        changes: QueryChange[] | undefined,
        method?: UpdateMethod
    ) => Promise<boolean>;

    /**
     * Determine the URL that we would get if we changed an URL argument
     *
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     */
    getURLForQueryChange: (key: string, rawValue: string | undefined) => string;

    /**
     * Determine the URL that we would get if we changed the path and also some URL arguments
     *
     * @param changes The changes to calculate
     */
    getURLForPathAndQueryChanges: (
        position: number | undefined,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined
    ) => string;

    /**
     * Set a query variable
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     * @param method The method to use for updating the URL.
     */
    doSetQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod) => void;

    /**
     * Try to set a query variable
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     * @param method The method to use for updating the URL.
     */
    trySetQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod) => Promise<boolean>;

    /**
     * Register a permanent URl argument.
     */
    registerUrlArg: (arg: UrlArg<any>) => void;

    /**
     * Set a redirect
     */
    setRedirect: (redirect: Redirect) => void;
}

/**
 * The interface we use when injecting the Location Manager
 */
export interface UsesLocation {
    locationManager?: LocationManager;
}
