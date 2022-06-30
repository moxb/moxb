/**
 * This interface describes a redirect.
 *
 * Redirects are supposed to statically declared, while initializing the application.
 * (See the `setRedirect()` call on the `LocationManager` interface.)
 */
export interface RedirectDefinition {
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
