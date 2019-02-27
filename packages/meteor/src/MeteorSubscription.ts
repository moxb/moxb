export interface MeteorSubscription {
    /** @deprecated since version v0.2.0-beta.18 */
    readonly isSubscriptionReady: boolean;

    /**
     * Is this subscription still pending?
     *
     * **Note**: This must be checked in the render function, else
     * the auto subscription mechanism does not work!
     *
     * Background: we use mobx onBecomeObserved on this attribute to subscribe to the meteor subscription.
     */
    readonly pending: boolean;

    /**
     * Has this subscription failed?
     *
     * If yes, there should be some errors, and an error message, too
     */
    readonly hasFailed: boolean;

    /**
     * Any errors encountered
     */
    readonly errors: any[];

    /**
     * Errors formatted as user-readable strings
     */
    readonly errorMessage?: string;
}
