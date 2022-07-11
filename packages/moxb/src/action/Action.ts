import { Bind } from '../bind/Bind';

export interface Action extends Bind {
    /**
     * A confirmation question that should be put to the user before really firing the action
     *
     * (Please note that this behaviour must be implemented by the UI element exposing the Action,
     * and not by ActionImpl itself.)
     */
    readonly confirmQuestion?: string;

    /**
     * Execute the action.
     *
     * Call this version if you are not interested in any results.
     */
    fire(): void;

    /**
     * Execute the action, and return a promise.
     *
     * Call this version if you want to observe the results.
     */
    firePromise(): Promise<void>;

    /**
     * Is the action currently being executed?
     */
    readonly pending: boolean;

    /**
     * Keyboard shortcuts associated with this action. Interpretation depends on the implementation in the
     * {@Keyboard}
     */
    readonly keyboardShortcuts: string[];
}
