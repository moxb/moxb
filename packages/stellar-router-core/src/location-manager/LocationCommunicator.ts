/**
 * This is the interface that a component must implement, in order to communicate with the user
 * about the location events.
 */
export interface LocationCommunicator {
    /**
     * Ask the user the specified questions, and get confirmation to actually leave the current state
     * @param questions
     *
     * Note: if this is called at a time when a previous question is already being asked,
     * the previous question is supposed to be removed, and the promise resolved with a false.
     */
    confirmLeave(questions: string[]): Promise<boolean>;

    /**
     * Is the dialog displayed currently?
     */
    isActive(): boolean;

    /**
     * Cancel the current question.
     * (This might be called when something happens while waiting for the answer.)
     *
     * When this happens, the prompt should be removed, and the promise should be resolved
     * with a false value.
     */
    revokeCurrentQuestion(): void;
}
