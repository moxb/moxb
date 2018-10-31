import { SubState } from './StateSpace';

import { StateSpaceHandlerProps, StateSpaceHandler } from './StateSpaceHandler';

import { UsesLocation } from './LocationManager';
import { UrlArg } from './UrlArg';
import { Navigable } from './navigable';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';

export interface StateSpaceAndLocationHandlerProps extends StateSpaceHandlerProps, UsesLocation, Navigable {
    /**
     * The URL argument (if any) driving this component.
     */
    arg?: UrlArg<string>;

    /**
     * A key generator to use to address hierarchically nested sub-states.
     */
    keyGen?: SubStateKeyGenerator;

    /**
     * An potential ID, for debugging
     */
    id?: string;
}

/**
 * This interface describes how the identify a sub-state within a state-space
 */
export interface SubStateSpecification {
    /**
     * What are the parent path tokens to choose to reach the level
     * where the current sub-state is directly accessible?
     */
    parentPathTokens: string[];

    /**
     * The sub-state itself
     */
    subState: SubState;

    /**
     * The menu key generated for this sub-state
     */
    key: string;
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
    isSubStateActive(state: SubStateSpecification): boolean;

    /**
     * Get the list of active SubStates. (At the current location.)
     */
    getActiveSubStates(): SubStateSpecification[];

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
