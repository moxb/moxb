/**
 * A Navigable is a component that takes part in the navigation tree.
 *
 * When we render it, if it is an active component, it needs to know
 * where it stands in the tree.
 */
export interface Navigable {
    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;
}
