import { StateCondition, StateSpace, SubState } from './StateSpace';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { NavStateHooks } from '../../navigable';
import { LinkGenerator, NavRef } from '../../navigation-references';
import { SubStateInContext } from './SubStateInContext';

export interface FilterParams {
    recursive?: boolean;
    onlyVisible?: boolean;
    onlyLeaves?: boolean;
    onlySatisfying?: boolean;
    noDisplayOnly?: boolean;
}

/**
 * A StateSpace handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of the app),
 * and can do various calculations on it.
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related (label and content) types
 * as type parameters.
 */
export interface StateSpaceHandler<LabelType, WidgetType, DataType> {
    /**
     * Expose the subStates together with the computed context information.
     */
    readonly _subStatesInContext: SubStateInContext<LabelType, WidgetType, DataType>[];

    /**
     * Find the root subState, if defined.
     */
    findRoot(): SubState<LabelType, WidgetType, DataType>;

    /**
     * Find a subState with a given menuKey
     *
     * If it can't be found, and exception is thrown.
     */
    findStateForMenuKey(menuKey: string): SubStateInContext<LabelType, WidgetType, DataType>;

    /**
     * Find a subState with a given navRef
     *
     * If it can't be found, and exception is thrown.
     */
    findStateForNavRef(navRef: NavRef<any>): SubStateInContext<LabelType, WidgetType, DataType>;

    /**
     * Is the given sub-state active for a given set of tokens?
     *
     * @param state The sub-state to check
     * @param wantedTokens The token list to check against
     * @param parsedTokens The number of tokens already parser
     */
    isSubStateActiveForTokens(
        state: SubStateInContext<LabelType, WidgetType, DataType>,
        wantedTokens: (string | null)[],
        parsedTokens: number
    ): boolean;

    /**
     * Collect the active sub-states for a given set of tokens
     *
     * @param wantedTokens The token list to check against
     * @param parsedTokens The number of tokens already parser
     * @param leavesOnly Should we skip groups?
     */
    getActiveSubStatesForTokens(
        wantedTokens: (string | null)[],
        parsedTokens: number,
        leavesOnly: boolean
    ): SubStateInContext<LabelType, WidgetType, DataType>[];

    /**
     * Find the subState for a given token.
     *
     * If token is null or empty string, returns the root subState.
     */
    findSubStateForTokens(
        wantedTokens: (string | null)[],
        parsedTokens?: number
    ): SubStateInContext<LabelType, WidgetType, DataType> | null;

    /**
     * Get a list of subStates that are not hidden, and match the specified filter, if any
     */
    getFilteredSubStates(params: FilterParams): SubStateInContext<LabelType, WidgetType, DataType>[];

    /**
     * Register navigation state change hooks for a given sub-state
     *
     * @param subState The sub-state to which the hooks belong to
     * @param hooks The hooks to register
     * @param componentId An ID for the component (in case there are more than one set of hooks) (Optional)
     */
    registerNavStateHooksForSubState(
        subState: SubStateInContext<LabelType, WidgetType, DataType>,
        hooks: NavStateHooks,
        componentId?: string
    ): void;

    /**
     * Unregister navigation state change hooks for a given sub-state
     *
     * @param subState The sub-state to which the hooks belong to
     * @param componentId An ID for the component (in case there are more than one set of hooks) (Optional)
     */
    unregisterNavStateHooksForSubState(
        subState: SubStateInContext<LabelType, WidgetType, DataType>,
        componentId?: string
    ): void;
}

/**
 * The props given to a StateSpaceHandler
 */
export interface StateSpaceHandlerProps<LabelType, WidgetType, DataType> {
    /**
     * An ID, for debugging
     */
    id: string;

    /**
     * The list of sub-states to work with
     */
    stateSpace: StateSpace<LabelType, WidgetType, DataType>;

    /**
     * An optional condition to use for filtering when displaying in a menu
     */
    filterCondition?: StateCondition<DataType>;

    /**
     * A key generator to use to address hierarchically nested sub-states.
     */
    keyGen?: SubStateKeyGenerator;

    /**
     * A link generator is necessary to resolve navigation refenreces.
     */
    linkGenerator?: LinkGenerator;

    /**
     * Should this component run in debug mode?
     */
    debug?: boolean;
}
