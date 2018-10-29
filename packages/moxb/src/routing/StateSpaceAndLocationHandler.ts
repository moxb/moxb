import { SubState } from './StateSpace';

import { StateSpaceHandlerProps, StateSpaceHandler } from './StateSpaceHandler';

import { UsesLocation } from './LocationManager';
import { UrlArg } from './UrlArg';
import { Navigable } from './navigable';

export interface StateSpaceAndLocationHandlerProps extends StateSpaceHandlerProps, UsesLocation, Navigable {
    arg?: UrlArg<string>;
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
    isSubStateActive(state: SubState): boolean;

    /**
     * Get the list of active SubStates. (At the current location.)
     */
    getActiveSubStates(): SubState[];

    /**
     * Get the list of of the keys of the active SubStates. (At the current location.)
     */
    getActiveSubStateKeys(): string[];

    /**
     * Change the location so that the given SubState becomes active.
     */
    selectSubState(state: SubState): void;

    /**
     * Change the location so that the SubState with the given key becomes active.
     */
    selectKey(key: string): void;
}
