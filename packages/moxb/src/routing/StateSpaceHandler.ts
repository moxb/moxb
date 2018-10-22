import { StateSpace, SubState } from "./StateSpace";

import { LocationManager } from "./LocationManager";
import { UrlArg } from "./UrlArg";

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states), and can do
 * various calculations on it.
 */

export interface StateSpaceHandlerProps {
    locationManager: LocationManager;
    rootPath?: string;
    arg?: UrlArg<string>;    
    substates: StateSpace;
}

export interface StateSpaceHandler {
    getPathForSubState(state: SubState): string;
    isSubStateActive(state: SubState): boolean;
    findRoot(): SubState;
    findSubState(path: string): SubState;
    getActiveSubStates(): SubState[];
    getActiveSubStatePaths(): string[];
}
