import { NavControl, StateCondition, StateSpace, UrlArg } from '@moxb/stellar-router-core';
import { UIFragment, UIFragmentSpec } from '@moxb/react-html';

/**
 * Parameters for controlling a LocationDependentArea
 */
export interface LocationDependentAreaProps<DataType> {
    /**
     * An ID, for debugging
     */
    id: string;

    /**
     * The list of sub-states to work with
     */
    stateSpace: StateSpace<UIFragment, UIFragmentSpec, DataType>;

    /**
     * The number of tokens on the paths already consumed to get here
     */
    parsedTokens?: number;

    /**
     * An optional condition to use for filtering which sub-states are available
     */
    filterCondition?: StateCondition<DataType>;

    /**
     * Should this component run in debug mode?
     */
    debug?: boolean;

    /**
     * The URL argument (if any) driving this component.
     */
    arg?: UrlArg<any>;

    /**
     * Should we register this object with a location manager as a change interceptor?
     * (Required for registering on-leave handlers and such)
     */
    intercept?: boolean;

    /**
     * If this component is embedded in a larger navigation space, we can pass in some controls
     */
    navControl?: NavControl;

    /**
     * When multiple parts of the layout needs to change
     * based on the same value, we can describe all of those
     * in a shared state space, as a map.
     * Here you can specify which part to pick.
     * If there is only one element of the layout that changes,
     * you can skip this/
     */
    part?: string;

    /**
     * Should we use the token mappings defined for the sub-states?
     */
    useTokenMappings?: boolean;

    /**
     * Should we mount (but hide) the content of all possible selections of the state space?
     *
     * This will pass an invisible = true parameter to all children. The children react to that.
     *
     * Defaults to false.
     */
    mountAll?: boolean;
}
