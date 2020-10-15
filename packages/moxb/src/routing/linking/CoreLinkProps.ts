import { ArgChange } from '../url-arg';
import { NavRef, NavRefCall } from '../navigation-references';

/**
 * A data structure to describe where a link should point to.
 *
 * There are four different method to do this.
 * You are free to use whichever is the most convenient at a given situation.
 *
 * Method 1: `appendTokens` [ + argChanges ]
 *
 *   The given list tokens will be appended to the current path.
 *   ArgChanges will also be executed.
 *
 * Method 2: `removeTokenCount` [ + argChanges ]
 *
 *   The given number of tokens will be removed from the end of the current path.
 *   ArgChanges will also be executed.
 *
 * Method 3: 'to' + 'position' [ + argChanges]
 *
 *   The current path will be replace with the given list of tokens,
 *   starting from position. (If not given, everything will be replaced.)
 *   ArgChanges will also be executed.
 *
 * Method 4: specifying `toRef`
 *
 *    This will use a NavRef or NavRefCall to specify where to go.
 *
 */
export interface CoreLinkProps {
    /**
     * The path tokens to set.
     *
     * Required when using method #3 to specify the link target.
     */
    to?: string[];

    /**
     * Set the number of tokens to be preserved. further tokens will be dropped.
     *
     * Considered when using method #3 to specify the link target.
     */
    position?: number;

    /**
     * Tokens to append to the current tokens.
     *
     * Required when using method #1 to specify the link target.
     */
    appendTokens?: string[];

    /**
     * Number of tokens to remove from the current tokens. (Optional.)
     *
     * Don't is this together with the "to" option.
     */
    removeTokenCount?: number;

    /**
     * Do we have to set any URL arguments?
     *
     * This will be considered when using method #1, #2 or #3 to specify the link target.
     */
    argChanges?: ArgChange<any>[];

    /**
     * Should this link point to a NavRef?
     *
     * Required when using method #4 to specify the link target.
     * When given, this will override to, appendTokens, etc..
     */
    toRef?: NavRef<void | {}> | NavRefCall<any>;
}
