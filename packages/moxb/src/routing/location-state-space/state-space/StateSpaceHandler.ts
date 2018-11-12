import { StateSpace, SubState, StateCondition, SubStateInContext } from './StateSpace';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of the app),
 * and can do various calculations on it.
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related (label and content) types
 * as type parameters.
 */
export interface StateSpaceHandler<LabelType, WidgetType> {
    /**
     * Expose the subStates together with the computed context information.
     */
    readonly _subStatesInContext: SubStateInContext<LabelType, WidgetType>[];

    /**
     * Find the root subState, if defined.
     */
    findRoot(): SubState<LabelType, WidgetType>;

    /**
     * Find the subState for a given token.
     *
     * If token is null or empty string, returns the root subState.
     */
    findSubState(
        currentTokens: (string | null)[],
        parsedTokens?: number
    ): SubStateInContext<LabelType, WidgetType> | null;

    /**
     * Get a list of subStates that are not hidden, and match the specified filter, if any
     */
    getFilteredSubStates(): SubStateInContext<LabelType, WidgetType>[];
}

/**
 * The props given to a StateSpaceHandler
 */
export interface StateSpaceHandlerProps<LabelType, WidgetType> {
    /**
     * An optional ID, for debugging
     */
    id?: string;

    /**
     * The list of sub-states to work with
     */
    subStates: StateSpace<LabelType, WidgetType>;

    /**
     * An optional condition to use for filtering when displaying in a menu
     */
    filterCondition?: StateCondition<LabelType, WidgetType>;

    /**
     * A key generator to use to address hierarchically nested sub-states.
     */
    keyGen?: SubStateKeyGenerator;

    /**
     * Should this component run in debug mode?
     */
    debug?: boolean;
}
