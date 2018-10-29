import { SubState } from './StateSpace';

import { StateSpaceHandlerProps, StateSpaceHandler } from './StateSpaceHandler';

import { UsesLocation } from './LocationManager';
import { UrlArg } from './UrlArg';
import { Navigable } from './navigable';

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states), and can do
 * various calculations on it.
 */

export interface StateSpaceAndLocationHandlerProps extends StateSpaceHandlerProps, UsesLocation, Navigable {
    arg?: UrlArg<string>;
}

export interface StateSpaceAndLocationHandler extends StateSpaceHandler {
    isSubStateActive(state: SubState): boolean;
    getActiveSubStates(): SubState[];
    getActiveSubStateKeys(): string[];
    selectSubState(state: SubState): void;
    selectKey(key: string): void;
}
