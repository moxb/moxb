import {
    //    SubState,
    StateSpace,
    UIFragmentSpec,
    //    UIFragmentMap,
} from '@moxb/moxb';

/**
 * A Navigable is a somponent that takes part in the navigation tree.
 *
 * When we render it, if it is an active component, it needs to know
 * where it stands in the tree.
 */
export interface Navigable {
    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;
}

export interface ChangingContentParams {
    // The state space to select from
    substates: StateSpace;

    // When multiple parts of the layout needs to change
    // based on the same value, we can describe all of those
    // in a shared state space, as a map.
    // Here you can specify which part to pick.
    // If there is only one element of the layout that changes,
    // you can skip this
    part?: string;

    // What to show when a given sub-state doesn't specify any content
    fallback?: UIFragmentSpec;

    // Should we mount (but hide) the content of all possible selections
    // of the state space? Defaults to false.
    mountAll?: boolean;

    // Enable debug output
    debug?: boolean;
}

// This interface describes the responsibilities of a "navigator",
// that is, a component that can show different content,
// based on the currently selected state.
export interface ChangingContentState extends Navigable{

    /**
     * The path tokens that determine the selection of sub-states.
     */
    tokens: string[];
}

export type ChangingContentProps = ChangingContentParams & ChangingContentState;
