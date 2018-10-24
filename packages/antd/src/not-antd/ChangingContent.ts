import {
    //    SubState,
    StateSpace,
    UIFragmentSpec,
    //    UIFragmentMap,
} from '@moxb/moxb';

// This interface describes the responsibilities of a "router",
// that is, a component that can show different content,
// based on the currently selected state.

/*
 Changing content can be controlled by two different means:
 
 1. Url path
 2. Url arguments

 For each mode, different properties need to be specified.
 See below for details
*/

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

export interface ChangingContentState {

    /**
     * The path tokens that determine the selection of sub-states.
     */
    tokens: string[];

    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;
}

export type ChangingContentProps = ChangingContentParams & ChangingContentState;
