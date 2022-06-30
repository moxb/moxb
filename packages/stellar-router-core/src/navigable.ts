/**
 * A Navigable is a component that takes part in the navigation tree.
 *
 * When we render it, if it is an active component, it needs to know
 * where it stands in the tree.
 */
import { StateCondition } from './location-state-space/state-space/StateSpace';
import { LocationManager } from './location-manager';

export type LeaveQuestionGenerator = () => string | null | undefined;

/**
 * These are the hooks that a Navigable component can optionally implement and register
 * to a nav control.
 */
export interface NavStateHooks {
    /**
     * Is it OK if we leave this state right now?
     * If there is some unsaved data, then return a string,
     * which will be presented to the user, in a question to confirm.
     *
     * If there is no unsaved data, return null or undefined.
     */
    getLeaveQuestion?: LeaveQuestionGenerator;
}

/**
 * Nav control interface, to control various aspects of the navigation
 */
export interface NavControl {
    /**
     * Returns the name of the controller component. (For debug.)
     */
    getParentName: () => string;

    /**
     * Returns the names of all parent controller components. (For debug.)
     */
    getAncestorNames: () => string[];

    /**
     * Am I currently active?
     */
    isActive: () => boolean;

    /**
     * Register some hooks to be called on navigation events
     */
    registerStateHooks: (hooks: NavStateHooks, componentId?: string) => void;

    /**
     * Unregister navigation event hooks
     */
    unregisterStateHooks: (componentId?: string) => void;
}

/**
 * This data structure will be made available to components
 * that are rendered as part of the navigation process
 */
export interface Navigable<DataType> {
    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;

    /**
     * An optional condition to use for filtering which sub-states are available
     */
    filterCondition?: StateCondition<DataType>;

    /**
     * When multiple parts of the layout needs to change
     * based on the same value, we can describe all of those
     * in a shared state space, as a map.
     * Here you can specify which part to pick.
     * If there is only one element of the layout that changes,
     * you can skip this.
     */
    part?: string;
}

/**
 * This data structure will be made available by their parents to components
 * that are rendered as part of the navigation process,
 * and have their own navigable content
 */
export interface NavigableContent<DataType> extends Navigable<DataType> {
    navControl: NavControl;
}

/**
 * Extract the next path token from the location manager, based on the number of parsed tokens passed down
 */
export function getNextPathToken<DataType>(props: Navigable<DataType> & { locationManager: LocationManager }): string {
    const { locationManager, parsedTokens } = props;
    return locationManager.pathTokens[parsedTokens!];
}

/**
 * Extract the already parsed path tokens from the location manager, based on the number of parsed tokens passed down
 */
export function getParsedPathTokens<DataType>(props: Navigable<DataType> & { locationManager: LocationManager }) {
    const { locationManager, parsedTokens } = props;
    return locationManager.pathTokens.slice(0, parsedTokens!);
}
