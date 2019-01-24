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
     * Do we have to set any URL arguments?
     */
    argChanges?: ArgChange<any>[];
}
