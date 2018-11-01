import { StateSpace, Navigable, UIFragmentSpec } from '@moxb/moxb';

export interface ChangingContentParams {
    /**
     * The state-space to select from
     */
    subStates: StateSpace;

    /**
     * When multiple parts of the layout needs to change
     * based on the same value, we can describe all of those
     * in a shared state space, as a map.
     * Here you can specify which part to pick.
     * If there is only one element of the layout that changes,
     * you can skip this/
     * */
    part?: string;

    /**
     * What to show when a given sub-state doesn't specify any content
     */
    fallback?: UIFragmentSpec;

    /**
     * Should we mount (but hide) the content of all possible selections
     * of the state space? Defaults to false.
     */
    mountAll?: boolean;

    /**
     * Enable debug output
     */
    debug?: boolean;
}

/**
 * This interface describes the responsibilities of a "navigator",
 * that is, a component that can show different content,
 * based on the currently selected state.
 */
export interface ChangingContentState extends Navigable {
    /**
     * The path tokens that determine the selection of sub-states.
     */
    currentTokens: string[];
}

export type ChangingContentProps = ChangingContentParams & ChangingContentState;
