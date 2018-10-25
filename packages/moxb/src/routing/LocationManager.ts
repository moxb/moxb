import { Location as MyLocation } from 'history';
import { UrlArg } from './UrlArg';

import { Query } from './UrlSchema';

export interface QueryChange {
    key: string;
    value: string | undefined;
}

export type UpdateMethod = 'push' | 'replace';

/**
 * This interface describes the responsobilities of a Location Manager
 */
export interface LocationManager {
    // These flags describe whether the current location shoulde be
    // considered stable, or it's temporary in the sense that we are
    // in the middle of an operation that will generate another
    // change very soon.
    final: boolean;

    // This flag is the opposite of the final flag.
    // You can read or write any of them.
    temporary: boolean;

    // Get the actual location.
    readonly location: MyLocation;

    // path tokens for the current location
    pathTokens: string[];

    // the search queries for the current location
    query: Query;

    // Determine the URL that we would get if we pushed these path tokens.
    // (See the pushPathTokens method)
    getURLForPathTokens: (position: number, tokens: string[]) => string;

    // Set the last path token
    // Previous tokens will be preserved, further tokens will be dropped.
    pushPathTokens: (position: number, tokens: string[]) => void;

    // Determine the URL that we would get if we changed an URL argument
    getURLForQueryChanges: (changes: QueryChange[]) => string;

    // Determine the URL that we would get if we changed an URL argument
    getURLForQueryChange: (key: string, rawValue: string | undefined) => string;

    // Push new valuse to some query variables
    pushQueryChanges: (changes: QueryChange[]) => void;

    // Replace somes query values with new values
    replaceQueryChanges: (changes: QueryChange[]) => void;

    // Push a new value to a query variable
    pushQueryChange: (key: string, rawValue: string | undefined) => void;

    // Replace a query value with a new value
    replaceQueryChange: (key: string, rawValue: string | undefined) => void;

    // Determine whether a given token at a given level matches
    doesPathTokenMatch: (token: string, level: number, exactOnly: boolean) => boolean;

    // Register a URl argument.
    registerUrlArg: (arg: UrlArg<any>) => void;
}

export interface UsesLocation {
    locationManager?: LocationManager;
}
