/**
 * This interface describes all the data that is needed to display a navigation link
 */
import { CoreLinkProps } from './CoreLinkProps';

export interface BoundLink extends CoreLinkProps {
    // The actual target of the link is described in CoreLinkProps

    /**
     * Operation ID
     */
    readonly id: string;

    /**
     * Label to display
     */
    readonly label: string;

    /**
     * Should this be hidden?
     */
    readonly invisible: boolean;
}
