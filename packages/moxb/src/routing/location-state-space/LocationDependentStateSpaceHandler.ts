import { LocationManager, SuccessCallback, UpdateMethod } from '../location-manager';
import { NavControl, Navigable } from '../navigable';
import { TokenManager } from '../TokenManager';
import { UrlArg } from '../url-arg';
import { SubStateInContext } from './state-space/StateSpace';
import { StateSpaceHandler, StateSpaceHandlerProps } from './state-space/StateSpaceHandler';
import { LocationChangeInterceptor } from '../location-manager/LocationManager';

export interface LocationDependentStateSpaceHandlerProps<LabelType, WidgetType, DataType>
    extends StateSpaceHandlerProps<LabelType, WidgetType, DataType>,
        Navigable<DataType> {
    /**
     * The Location Manager to use
     */
    locationManager: LocationManager;

    /**
     * The Token Manager to use.
     *
     * This is optional; if not provided, tokens won't be supported.
     */
    tokenManager?: TokenManager;

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
}

/**
 * A StateSpaceAndLocation handler takes a description of the state-space
 * (that is, the list of defined sub-states for a given part of ahe UI),
 * and also looks at the location,
 * and can do various calculations and operations,
 * using this two sources of information.
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related (label and content) types
 * as type parameters.
 */
export interface LocationDependentStateSpaceHandler<LabelType, WidgetType, DataType>
    extends StateSpaceHandler<LabelType, WidgetType, DataType>,
        LocationChangeInterceptor {
    /**
     * Register the mappings belonging to this state sub-tree on the token manager
     */
    registerTokenMappings(): void;

    /**
     * Unregister token mappings
     */
    unregisterTokenMappings(): void;

    /**
     * Is this SubState currently active? (Given the location.)
     */
    isSubStateActive(state: SubStateInContext<LabelType, WidgetType, DataType>): boolean;

    /**
     * Get the list of active SubStates at the current location, potentially including groups.
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStates(leavesOnly: boolean): SubStateInContext<LabelType, WidgetType, DataType>[];

    /**
     * Get the (single) active sub-state at the current location. (Must be a leaf.)
     */
    getActiveSubState(): SubStateInContext<LabelType, WidgetType, DataType> | null;

    /**
     * Get the list of the menu keys of the active SubStates. (At the current location.)
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStateMenuKeys(leavesOnly: boolean): string[];

    /**
     * Change the location so that the given SubState becomes active.
     */
    doSelectSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): void;

    /**
     * Gracefully attempt to change the location so that the given SubState becomes active.
     */
    trySelectSubState(
        state: SubStateInContext<LabelType, WidgetType, DataType>,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ): void;

    /**
     * Change the location so that the SubState with the given key becomes active.
     */
    doSelectByTokens(tokens: string[]): void;

    /**
     * Get the URL that would select a given sub-state
     */
    getUrlForSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): string;
}
