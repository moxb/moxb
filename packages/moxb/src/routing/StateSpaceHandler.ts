import { StateSpace, SubState, StateCondition, SubStateInContext } from './StateSpace';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of the app),
 * and can do various calculations on it.
 */
export interface StateSpaceHandler {
    /**
     * Find the root subState, if defined.
     */
    findRoot(): SubState;

    /**
     * Find the subState for a given token.
     *
     * If token is null or empty string, returns the root subState.
     */
    findSubState(currentTokens: (string | null)[], parsedTokens?: number): SubStateInContext | null;

    /**
     * Get a list of subStates that are not hidden, and match the specified filter, if any
     */
    getFilteredSubStates(): SubStateInContext[];
}

/**
 * The props given to a StateSpaceHandler
 */
export interface StateSpaceHandlerProps {
    /**
     * An optional ID, for debugging
     */
    id?: string;

    /**
     * The list of sub-states to work with
     */
    subStates: StateSpace;

    /**
     * An optional condition to use for filtering when displaying in a menu
     */
    filterCondition?: StateCondition;

    /**
     * A key generator to use to address hierarchically nested sub-states.
     */
    keyGen?: SubStateKeyGenerator;

    /**
     * Should this component run in debug mode?
     */
    debug?: boolean;
}
