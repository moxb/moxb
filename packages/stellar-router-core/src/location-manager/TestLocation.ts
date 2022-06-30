import { Query } from '../url-schema/UrlSchema';

/**
 * This interface is internal to the navigation system.
 * Some components can recognize their interest in navigation changes,
 * in order to signal that it might be problematic (i.e. the user might lose
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
    doPathTokensMatch?: (token: string[], level: number, exactOnly: boolean, debugMode?: boolean) => boolean;

    /**
     * the search queries for the current location
     */
    readonly query: Query;
}
