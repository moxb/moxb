import { StateSpaceHandlerProps, StateSpaceHandler } from './StateSpaceHandler';

import { UsesLocation } from './LocationManager';
import { UrlArg } from './UrlArg';
import { Navigable } from './navigable';
import { SubStateInContext } from './StateSpace';

export interface StateSpaceAndLocationHandlerProps extends StateSpaceHandlerProps, UsesLocation, Navigable {
    /**
     * The URL argument (if any) driving this component.
     */
    arg?: UrlArg<string>;

    /**
     * An potential ID, for debugging
     */
    id?: string;
}

/**
 * A StateSpaceAndLocation handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of ahe UI),
 * and also looks at the location,
 * and can do various calculations and operations,
 * using this two sources of information.
 */
export interface StateSpaceAndLocationHandler extends StateSpaceHandler {
    /**
     * Is this SubState currently active? (Given the location.)
     */
    isSubStateActive(state: SubStateInContext): boolean;

    /**
     * Get the list of active SubStates. (At the current location.)
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStates(leavesOnly: boolean): SubStateInContext[];

    /**
     * Get the list of the menu keys of the active SubStates. (At the current location.)
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStateMenuKeys(leavesOnly: boolean): string[];

    /**
     * Change the location so that the given SubState becomes active.
     */
    selectSubState(state: SubStateInContext): void;

    /**
     * Change the location so that the SubState with the given key becomes active.
     */
    selectByTokens(tokens: string[]): void;

    /**
     * Get the URL that would select a given sub-state
     */
    getUrlForSubState(state: SubStateInContext): string;
}
