/**
 * This interface describes all the data that is needed to display a navigation link
 */
import { CoreLinkProps } from './CoreLinkProps';
import { AnyDecision } from '../../decision';

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
     * Help to be displayed (in a popup), if any
     */
    readonly help: string | undefined;

    /**
     * Should this be hidden?
     */
    readonly invisible: boolean;

    /**
     * Should this be disabled?
     */
    readonly disabled: AnyDecision;
}
