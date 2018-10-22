import { StateSpace, SubState } from "./StateSpace";

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states), and can do
 * various calculations on it.
 */

export interface StateSpaceHandlerProps {
    substates: StateSpace;
}

export interface StateSpaceHandler {
    findRoot(): SubState;
    findSubState(path: string): SubState;
}
