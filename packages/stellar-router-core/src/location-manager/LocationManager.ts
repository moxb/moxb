import { Path, To } from 'history';

export type MyLocation = Path;
export type LocationDescriptorObject = To;

import { ValueOrFunction } from '@moxb/moxb';

import { UrlArg } from '../url-arg';

import { Query, QueryChange, UrlSchema } from '../url-schema/UrlSchema';
import { CoreLinkProps } from '../linking/CoreLinkProps';
import { RedirectDefinition } from './RedirectDefinition';
import { LocationChangeInterceptor } from './LocationChangeInterceptor';

export type SuccessCallback = (value: boolean) => void;

/**
 * The possible methods for updating the location, in relation to the history.
 */
export enum UpdateMethod {
    NONE = 'none', // Don't set the location at all. (Used for test-runs.)
    PUSH = 'push', // Push a new element to the history
    REPLACE = 'replace', // Replace the current element of history
}

/**
 * The Location Manager is responsible for tracking the location (i.e. URL) of the application,
 * and abstract away the interface by providing separate path tokens and URL arguments.
 *
 * It is one of the main entry points you should be interacting with.
 *
 * This interface defines the app-facing functionality.
 *
 * In many cases, the APIs come in pairs:
 * - there is a `doWhatever()` call, which executes the operation right away,
 * - there is a `tryWhatever()` call, which will negotiate will all the registered
 *   navigation interceptors, then maybe ask for a confirmation from the user,
 *   and then might (or might not) execute the change.
 *   These second method accepts an optional callback as a final parameter,
 *   which will be called with a boolean value, signaling whether it was executed.
 *
 * Generally speaking, you should use the `tryWhatever()` form,
 * unless there is a compelling reason not to.
 */
interface LocationManagerCore {
    /**
     * Path tokens for the current location
     *
     * Basically, this is where you are in the application now.
     */
    readonly pathTokens: string[];

    /**
     * Set a redirect
     */
    setRedirect: (redirect: RedirectDefinition) => void;

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
     * Tries to append a set of tokens to the current path
     *
     * @param tokens The tokens to append.
     * @param method The method to use for updating the URL.
     */
    tryAppendPathTokens: (tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) => void;

    /**
     * Removes the given number of path tokens from the current path.
     */
    doRemovePathTokens: (count: number, method?: UpdateMethod) => void;

    /**
     * Removes the given number of path tokens from the current path.
     */
    tryRemovePathTokens: (count: number, method?: UpdateMethod, callback?: SuccessCallback) => void;

    /**
     * Define a string UrlArg
     *
     * @param key The key of the underlying query parameter
     * @param defaultValue What should it mean when the query parameter is not present? (The default is an empty string)
     * @param permanent Should this be retained when the path changes?
     */
    defineStringArg<T = string>(key: string, defaultValue?: T, permanent?: boolean): UrlArg<T>;

    /**
     * Define an optional string UrlArg
     *
     * When not present it will return undefined.
     */
    defineOptionalStringArg<T = string>(key: string, permanent?: boolean): UrlArg<T | undefined>;

    /**
     * Define a boolean UrlArg
     *
     * When not present, and no default defined, it will return false.
     */
    defineBooleanArg(key: string, defaultValue?: ValueOrFunction<boolean>, permanent?: boolean): UrlArg<boolean>;

    /**
     * Define an integer UrlArg
     *
     * When not present, and no default defined, it will return a zero.
     */
    defineIntegerArg(key: string, defaultValue?: ValueOrFunction<number>, permanent?: boolean): UrlArg<number>;

    /**
     * Define an optional integer UrlArg
     *
     * When not present, it will return undefined.
     */
    defineOptionalIntegerArg(key: string, permanent?: boolean): UrlArg<number | undefined>;

    /**
     * Define a date UrlArg
     */
    defineDateArg(key: string, defaultValue: ValueOrFunction<Date>, permanent?: boolean): UrlArg<Date>;

    /**
     * Define an optional date UrlArg
     *
     * When not present, it will return undefined.
     */
    defineOptionalDateArg(key: string, permanent?: boolean): UrlArg<Date | undefined>;

    /**
     * Define an unordered string array UrlArg
     */
    defineUnorderedStringArrayArg(
        key: string,
        defaultValue?: ValueOrFunction<string[]>,
        permanent?: boolean
    ): UrlArg<string[]>;

    /**
     * Define an ordered string array UrlArg
     */
    defineOrderedStringArrayArg(
        key: string,
        defaultValue?: ValueOrFunction<string[]>,
        permanent?: boolean
    ): UrlArg<string[]>;

    /**
     * Define a URL arg for storing a serialized object
     */
    defineObjectArg<T>(key: string, defaultValue?: ValueOrFunction<T | null>, permanent?: boolean): UrlArg<T | null>;

    /**
     * Define an unordered enum array UrlArg
     */
    defineUnorderedArrayArg<BaseType>(
        key: string,
        defaultValue?: ValueOrFunction<BaseType[]>,
        permanent?: boolean
    ): UrlArg<BaseType[]>;

    /**
     * Define an ordered enum array UrlArg
     */
    defineOrderedArrayArg<BaseType>(
        key: string,
        defaultValue?: ValueOrFunction<BaseType[]>,
        permanent?: boolean
    ): UrlArg<BaseType[]>;
}

/**
 * The Location Manager is responsible for tracking the location (i.e. URL) of the application,
 * and abstract away the interface by providing separate path tokens and URL arguments.
 *
 * It is one of the main entry points you should be interacting with.
 *
 * This interface extends the app-facing functionality with some internal technical details.
 */
export interface LocationManager extends LocationManagerCore {
    /**
     * Expose the currently used UrlSchema.
     *
     * (This shouldn't be interesting for the application code.)
     */
    readonly _urlSchema: UrlSchema;

    /**
     * Register a component that is interested in the location.
     *
     * (This should only be done from within the navigation libraries and components.)
     */
    _registerChangeInterceptor: (interceptor: LocationChangeInterceptor) => void;

    /**
     * The current location.
     *
     * Internal detail only, don't use it application code.
     */
    readonly _location: MyLocation;

    /**
     * Get the path tokens for a given location
     *
     * (This should only be used by navigation components)
     */
    _getPathTokensForLocation(location: MyLocation): string[];

    /**
     * Determine whether a given token at a given level matches
     *
     * @param tokens The tokens to test against the current location
     * @param level The level where the token should be found
     * @param exactOnly Is it a match only if there are no further tokens?
     *
     * (This should only be used by navigation components)
     */
    _doPathTokensMatch: (token: string[], level: number, exactOnly: boolean, debugMode?: boolean) => boolean;

    /**
     * Determine the URL that we would get if we pushed these path tokens.
     *
     * @param position Where to push the tokens? (How many levels to retain?)
     * @param tokens The tokens to push
     *
     * (This should only be used by navigation components)
     */
    _getURLForPathTokens: (position: number, tokens: string[]) => string;

    /**
     * Calculate what would be the new location, if these tokens were to be added to the path
     *
     * (This should only be used by navigation components.)
     */
    _getNewLocationForAppendedPathTokens: (tokens: string[]) => MyLocation;

    /**
     * Calculate what would be the new location, if this many tokens were to be removed from the path
     *
     * (This should only be used by navigation components.)
     */
    _getNewLocationForRemovedPathTokens: (count: number) => MyLocation;

    /**
     * the search queries for the current location
     *
     * Please note that normally you should access the query parameters via UrlArgs.
     */
    readonly _query: Query;

    /**
     * Set some query parameters
     *
     * @param changes The query changes to execute
     * @param method The method to use for updating the URL.
     *
     * Please note that normally you should access the query parameters via UrlArgs.
     */
    _doSetQueries: (changes: QueryChange[], method?: UpdateMethod) => void;

    /**
     * Try to set some query variables
     *
     * @param changes The changes to execute
     * @param method The method to use for updating the URL.
     *
     * Please note that normally you should access the query parameters via UrlArgs.
     */
    _trySetQueries: (changes: QueryChange[], method?: UpdateMethod, callback?: SuccessCallback) => void;

    /**
     * the search queries for a given location
     *
     * (This should only be used by the navigation system itself.)
     */
    _getQueryForLocation(location: MyLocation): Query;

    /**
     * Determine the URL that we would get if we changed some query parameters
     *
     * (This should only be used by the navigation system itself.)
     */
    _getURLForQueryChanges: (changes: QueryChange[]) => string;

    /**
     * Set the last few path tokens, and also some queries
     *
     * @param position Where to push the tokens? (Any tokens before this will be preserved.)
     * @param tokens The tokens to set.
     * @param changes The query changes to execute
     * @param method The method to use for updating the URL.
     *
     * Please note that normally you should only modify query parameters via UrlArgs.
     */
    _doSetPathTokensAndQueries: (
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
     *
     * Please note that normally you should only modify query parameters via UrlArgs.
     */
    _trySetPathTokensAndQueries: (
        position: number,
        tokens: string[] | undefined,
        changes: QueryChange[] | undefined,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ) => void;

    /**
     * Set the location to a new value.
     *
     * @param location The new location to set
     * @param method   The method to use for updating the URL
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _doSetLocation(location: LocationDescriptorObject | undefined, method?: UpdateMethod): void;

    /**
     * Try to set the location to a new value.
     *
     * This method may ask for confirmation, if necessary.
     *
     * @param location The new location to set
     * @param method   The method to use for updating the URL
     * @param callback Callback to call with the result status
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _trySetLocation(
        location: LocationDescriptorObject | undefined,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ): void;

    /**
     * Determine the URL that we would get if we changed a query parameter
     *
     * @param key The key of the parameter to change
     * @param rawValue The new value to set (already in string form)
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _getURLForQueryChange: (key: string, rawValue: string | undefined) => string;

    /**
     * Calculate what would be the new location, if these query changes were to be executed.
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _getNewLocationForQueryChanges: (baseLocation: MyLocation | undefined, changes: QueryChange[]) => MyLocation;

    /**
     * Calculate what would be the new location, if these path tokens were to be set, and these query changes were to be executed.
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _getNewLocationForPathAndQueryChanges: (
        baseLocation: MyLocation | undefined,
        position: number | undefined,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined,
        dropPermanent?: boolean
    ) => MyLocation;

    /**
     * Calculate what would be the new location, if a given link were to be used
     *
     * dropPermanent means that calculating such a way that we drop even the normally
     * retained permanent url arguments, too
     *
     * (Please note that this should only be used internally, by the navigation system.)
     */
    _getNewLocationForLinkProps: (link: CoreLinkProps, dropPermanent?: boolean) => MyLocation;

    /**
     * Determine the URL that we would get if we changed the path and also some URL arguments
     *
     * @param changes The changes to calculate
     */
    _getURLForPathAndQueryChanges: (
        position: number | undefined,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined
    ) => string;

    /**
     * Set a query variable
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     * @param method The method to use for updating the URL.
     *
     * Please note that normally, you should access the query parameters via UrlArgs.
     */
    _doSetQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod) => void;

    /**
     * Try to set a query variable
     * @param key The key of the argument to change
     * @param rawValue The new value to set (already in string form)
     * @param method The method to use for updating the URL.
     *
     * Please note that normally, you should access the query parameters via UrlArgs.
     */
    _trySetQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod, success?: SuccessCallback) => void;

    /**
     * Register a permanent URl argument.
     *
     * (This should be only done internally by the navigation system.)
     */
    _registerUrlArg: (arg: UrlArg<any>) => void;
}
