import { UrlArg } from '../url-arg';

import { Query } from '../url-schema/UrlSchema';

export type SuccessCallback = (value: boolean) => void;

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
    NONE = 'none', // Don't set the location at all. Used for test-runs.
    PUSH = 'push', // Push a new element to the history
    REPLACE = 'replace', // Replace the current element of history
}

/**
 * This interface describes a redirect.
 *
 * Redirects are supposed to statically declared, while initializing the application.
 * (See the `setRedirect()` call on the `LocationManager` interface.)
 */
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

/**
 * This interface is internal to the navigation system.
 * Some components can recognize their interest for navigation changes,
 * in order to signal that it might be problematic (ie. the user might lose
 * some unsaved data.)
 *
 * (See the `LocationUser` interface, and
 * the `registerUser()` method on the `LocationManager` interface.)
 *
 * Then these components will be notified about where we want to go.
 * When doing that, then we must pass on the wanted location.
 * For this, we use an interface that is _similar_ to `LocationManager`,
 * but a lot more restricted. This interface described that object.
 */
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
 * This interface is internal to the navigation system.
 * The interface a components that are interested in messing with location changes.
 */
export interface LocationChangeInterceptor {
    /**
     * This hook will be called before any "soft" navigation change event can succeed,
     * in order to collect any confirmation questions that must be presented to the user.
     *
     * @param location: Where we want to go
     */
    anyQuestionsFor(location: TestLocation): string[];
}

/**
 * The Location Manager is responsible for tracking the location (ie. URL) of the application,
 * and abstract away the interface by providing separate path tokens and URL arguments.
 *
 * In many cases, the APIs come in pairs:
 * - there is a `doWhatever()` call, which executes the operation right away,
 * - there is a `tryWhatever()` call, which will negotiate will all the registered
 *   navigation interceptors, then maybe ask for a confirmation from the user,
 *   and then might (or might not) execute the change.
 *   These second method accepts an optional callback as a final parameter,
 *   which will be called with a boolean value, signaling whether it was executed or now.
 */
export interface LocationManager {
    /**
     * Register a component that is interested in the location.
     */
    registerChangeInterceptor: (interceptor: LocationChangeInterceptor) => void;

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
    trySetPathTokens: (position: number, tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) => void;

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
    tryAppendPathTokens: (tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) => void;

    /**
     * Removes the given number of path tokens from the current path.
     */
    tryRemovePathTokens: (count: number, method?: UpdateMethod, callback?: SuccessCallback) => void;

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
    trySetQueries: (changes: QueryChange[], method?: UpdateMethod, callback?: SuccessCallback) => void;

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
        method?: UpdateMethod,
        callback?: SuccessCallback
    ) => void;

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
    trySetQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod, success?: SuccessCallback) => void;

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
