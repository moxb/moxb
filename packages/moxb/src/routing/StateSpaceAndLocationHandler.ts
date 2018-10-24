import { SubState } from "./StateSpace";

import { StateSpaceHandlerProps, StateSpaceHandler } from "./StateSpaceHandler";

import { LocationManager } from "./LocationManager";
import { UrlArg } from "./UrlArg";

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states), and can do
 * various calculations on it.
 */

export interface StateSpaceAndLocationHandlerProps extends StateSpaceHandlerProps {
    locationManager: LocationManager;
    parsedTokens?: number;
    arg?: UrlArg<string>;    
}

export interface StateSpaceAndLocationHandler extends StateSpaceHandler {
//    getRealPathForSubState(state: SubState): string;
    isSubStateActive(state: SubState): boolean;
    getActiveSubStates(): SubState[];
    getActiveSubStateKeys(): string[];
    selectSubState(state: SubState): void;
    selectKey(key: string): void;
}
