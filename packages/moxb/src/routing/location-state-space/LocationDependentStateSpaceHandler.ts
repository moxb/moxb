import { StateSpaceHandlerProps, StateSpaceHandler } from './state-space/StateSpaceHandler';

import { UsesLocation } from '../location-manager';
import { UrlArg } from '../url-arg';
import { Navigable } from '../navigable';
import { SubStateInContext } from './state-space/StateSpace';

export interface LocationDependentStateSpaceHandlerProps<LabelType, WidgetType>
    extends StateSpaceHandlerProps<LabelType, WidgetType>,
        UsesLocation,
        Navigable {
    /**
     * The URL argument (if any) driving this component.
     */
    arg?: UrlArg<any>;
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
export interface LocationDependentStateSpaceHandler<LabelType, WidgetType>
    extends StateSpaceHandler<LabelType, WidgetType> {
    /**
     * Is this SubState currently active? (Given the location.)
     */
    isSubStateActive(state: SubStateInContext<LabelType, WidgetType>): boolean;

    /**
     * Get the list of active SubStates at the current location, potentially including groups.
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStates(leavesOnly: boolean): SubStateInContext<LabelType, WidgetType>[];

    /**
     * Get the (single) active sub-state at the current location. (Must be a leaf.)
     */
    getActiveSubState(): SubStateInContext<LabelType, WidgetType> | null;

    /**
     * Get the list of the menu keys of the active SubStates. (At the current location.)
     *
     * leavesOnly: get only the terminal sub-states, no groups
     */
    getActiveSubStateMenuKeys(leavesOnly: boolean): string[];

    /**
     * Change the location so that the given SubState becomes active.
     */
    selectSubState(state: SubStateInContext<LabelType, WidgetType>): void;

    /**
     * Change the location so that the SubState with the given key becomes active.
     */
    selectByTokens(tokens: string[]): void;

    /**
     * Get the URL that would select a given sub-state
     */
    getUrlForSubState(state: SubStateInContext<LabelType, WidgetType>): string;
}
