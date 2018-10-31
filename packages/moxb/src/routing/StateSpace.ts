import { UIFragment, UIFragmentSpec } from './react-stuff';

// This interface describes a possible state for a part of the app UI
export interface SubState {
    /**
     * The label to identify this sub-state,
     *
     * when offered up for selection in a menu or similar
     */
    label: UIFragment;

    /**
     * A special label to use when this sub-state is active
     */
    activeLabel?: UIFragment;

    /**
     * The key to identify this sub-state. (Can be undefined if this is the root state)
     */
    key?: string;

    /**
     * Is this the root state?
     */
    root?: boolean;

    /**
     * Should this option be offered in menus and such?
     */
    hidden?: boolean;

    /**
     * Is this option currently disabled? If yes, this will option will be displayed, but won't be selectable.
     */
    disabled?: boolean;

    /**
     * What content so show in this sub-state?
     */
    fragment?: UIFragmentSpec;

    /**
     * Any further child states (for sub-menus, etc)
     */
    subStates?: SubState[];

    /**
     * If this is a group menu item, should the key for this item be prepended to the keys in this group?
     */
    hierarchical?: boolean;

    /**
     * Custom data
     */
    custom?: any;
}

/**
 * The totality of all possible states for a given part of the app UI
 */
export type StateSpace = SubState[];

/**
 * This interface describes how the identify a sub-state within a state-space
 */
export interface SubStateInContext extends SubState {
    /**
     * What are the parent path tokens to choose to reach the level
     * where the current sub-state is directly accessible?
     */
    parentPathTokens: string[];

    /**
     * What are the parent path tokens to choose to reach this sub-state?
     */
    totalPathTokens: string[];

    /**
     * Is this only a group item, created for menus?
     */
    isGroupOnly: boolean;

    /**
     * The menu key generated for this sub-state
     */
    menuKey: string;

    /**
     * We are restricting the SubStates array so that we know that they all must have context, too
     */
    subStates?: SubStateInContext[];
}

/**
 * A condition used to decide whether or not to offer a given SubState
 */
export type StateCondition = (item: SubState) => boolean;
