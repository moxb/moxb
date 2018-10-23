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
    // What is the root path of the current state? For mode 1
    rootPath?: string;

    /**
     * What is the path that we have to use to make the current decision?
     *
     * In case of a multi-level routing, this should also contain the part
     * of the path that has already been parsed, plus any further tokens.
     * Normally it should be an array of strings, but a single token is also
     * acceptable.
     */
    rawPath: string | string[];

    separator: string;
}

export type ChangingContentProps = ChangingContentParams & ChangingContentState;
