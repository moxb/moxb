import { StateSpace, SubState, StateCondition } from './StateSpace';

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states), and can do
 * various calculations on it.
 */

export interface StateSpaceHandlerProps {
    // The list of sub-states to work with
    subStates: StateSpace;

    // An optional condition to use for filtering when displaying in a menu
    filterCondition?: StateCondition;
}

export interface StateSpaceHandler {
    // Find the root subState, if defined.
    findRoot(): SubState;

    // Find the subState for a given token.
    //
    // If token is null or empty string, returns the root subState.
    findSubState(tokens: string[], parsedTokens?: number): SubState | null;

    // Get a list of subStates that are not hidden, and
    // match the specified filter, if any
    getFilteredSubStates(): SubState[];
}
