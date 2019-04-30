/**
 * A data structure to describe where a link should point to.
 */
import { ArgChange } from '../url-arg';

export interface CoreLinkProps {
    /**
     * The path tokens to set
     */
    to?: string[];

    /**
     * Set the number of tokens to be preserved. further tokens will be dropped.
     */
    position?: number;

    /**
     * Tokens to append to the current tokens. (Optional.)
     *
     * Don't is this together with the "to" option.
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
     */
    argChanges?: ArgChange<any>[];
}
