export interface DataSubscription {
    /**
     * **Note**: This must be checked in the render function, else
     * the auto subscription mechanism does not work!
     *
     * Background: we use mobx onBecomeObserved on this attribute to subscribe to the meteor subscription.
     */
    readonly isSubscriptionReady: boolean;
}
