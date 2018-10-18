import { UIFragment } from './react-stuff';

export interface UIFragmentMap {
    [id: string]: UIFragment;
}

export type UIFragmentSpec = UIFragment | UIFragmentMap | undefined;

// This interface describes a possible state for a part of the app UI
export interface SubState {
    // The label to identify this sub-state,
    // when offered up for selection in a menu or similar
    label: UIFragment;

    // A special label to use when this sub-state is active
    activeLabel?: UIFragment;

    // The path to identify this sub-state.
    // (Can be null if this is the root state)
    path?: string;

    // Is this the root state?
    root?: boolean;

    // Should this option be offered in menus?
    hidden?: boolean;

    // Is this option currently disabled?
    // If yes, this will option will be displayed, but won't be selectable.
    disabled?: boolean;

    // What content so show in this sub-state?
    fragment?: UIFragmentSpec;

    // Any further child states (for sub-menus, etc)
    subStates?: SubState[];

    // Custom data
    custom?: any;
}

// The totality of all possible states for a given part of the app UI
export type StateSpace = SubState[];
