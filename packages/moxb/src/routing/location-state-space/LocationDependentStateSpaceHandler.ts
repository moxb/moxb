import { StateSpaceHandlerProps, StateSpaceHandler } from './state-space/StateSpaceHandler';

import { UsesLocation } from '../location-manager/LocationManager';
import { UrlArg } from '../url-arg/UrlArg';
import { Navigable } from '../navigable';
import { SubStateInContext } from './state-space/StateSpace';

export interface LocationDependentStateSpaceHandlerProps extends StateSpaceHandlerProps, UsesLocation, Navigable {
    /**
     * The URL argument (if any) driving this component.
     */
    arg?: UrlArg<any>;
}

/**
 * A StateSpaceAndLocation handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of ahe UI),
 * and also looks at the location,
 * and can do various calculations and operations,
 * using this two sources of information.
 */
export interface LocationDependentStateSpaceHandler extends StateSpaceHandler {
    /**
     * Is this SubState currently active? (Given the location.)
     */
    isSubStateActive(state: SubStateInContext): boolean;

    /**
     * Get the list of active SubStates at the current location, potentially including groups.
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStates(leavesOnly: boolean): SubStateInContext[];

    /**
     * Get the (single) active sub-state at the current location. (Must be a leaf.)
     */
    getActiveSubState(): SubStateInContext | null;

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
