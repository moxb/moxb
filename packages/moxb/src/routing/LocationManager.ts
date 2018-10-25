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
    readonly pathTokens: string[];

    // Determine whether a given token at a given level matches
    doesPathTokenMatch: (token: string, level: number, exactOnly: boolean) => boolean;

    // Determine the URL that we would get if we pushed these path tokens.
    // (See the pushPathTokens method)
    getURLForPathTokens: (position: number, tokens: string[]) => string;

    // Set the last few path tokens
    // Previous tokens will be preserved, further tokens will be dropped.
    setPathTokens: (position: number, tokens: string[], method?: UpdateMethod) => void;

    // the search queries for the current location
    readonly query: Query;

    // Determine the URL that we would get if we changed an URL argument
    getURLForQueryChanges: (changes: QueryChange[]) => string;

    // Set some query variables
    setQueries: (changes: QueryChange[], method?: UpdateMethod) => void;

    // Determine the URL that we would get if we changed a single URL argument
    getURLForQueryChange: (key: string, rawValue: string | undefined) => string;

    // Set a single query variable
    setQuery: (key: string, rawValue: string | undefined, method?: UpdateMethod) => void;

    // Register a permanent URl argument.
    registerUrlArg: (arg: UrlArg<any>) => void;
}

export interface UsesLocation {
    locationManager?: LocationManager;
}
