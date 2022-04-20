import { Tracker } from 'meteor/tracker';
import {
    action,
    autorun,
    IReactionDisposer,
    observable,
    onBecomeObserved,
    onBecomeUnobserved,
    makeObservable,
} from 'mobx';
import { meteorAutorun } from './MeteorDependencies';
import { MeteorSubscription } from './MeteorSubscription';
import { extractErrorString } from '@moxb/moxb';

export abstract class MeteorSubscriptionImpl implements MeteorSubscription {
    @observable
    private nSubscriptions = 0;
    @observable
    private _isSubscriptionReady = false;
    @observable
    private _hasFailed = false;
    @observable
    private _errors: any[] = [];

    private subscriptionTracker?: Tracker.Computation;
    private mobxAutoRun?: IReactionDisposer;
    private timeoutHandle: any;

    constructor() {
        makeObservable(this);
        onBecomeObserved(this, '_isSubscriptionReady', () => {
            // console.log('subscribe=', this.constructor.name);
            this.subscribe();
        });
        onBecomeUnobserved(this, '_isSubscriptionReady', () => {
            // console.log('unsubscribe=', this.constructor.name);
            this.unsubscribe();
        });
        this._fail = this._fail.bind(this);
    }

    /** @deprecated since version v0.2.0-beta.18 */
    get isSubscriptionReady() {
        return this._isSubscriptionReady;
    }

    /** @deprecated since version v0.2.0-beta.18 */
    set isSubscriptionReady(value: boolean) {
        this._isSubscriptionReady = value;
    }

    /**
     * Mark this subscription as ready.
     * (This only makes sense during testing.)
     */
    _setReady() {
        this._isSubscriptionReady = true;
    }

    get hasFailed() {
        return this._hasFailed;
    }

    get errors() {
        return this._errors.slice();
    }

    get errorMessage() {
        return this._errors.map(extractErrorString).join('\n\n');
    }

    get pending() {
        return !this._isSubscriptionReady && !this._hasFailed;
    }

    protected _fail(error: any) {
        if (error) {
            // console.warn('Failing subscription', this._publicationName, ':', error);
            this._hasFailed = true;
            this._errors.push(error);
        }
    }

    protected _publicationName?: string;

    protected meteorSubscribe(publicationName: string, ...args: any[]) {
        this._publicationName = publicationName;
        return Meteor.subscribe(publicationName, ...args, {
            onStop: this._fail,
        });
    }

    @action.bound
    private subscribe() {
        this._errors = [];
        this._hasFailed = false;
        this.nSubscriptions++;
        if (this.nSubscriptions === 1 && !this.mobxAutoRun) {
            // We have to call the Meteor.Tracker.autorun async!
            // If we call it directly, and it is called form within another Tracker.autorun, this autorun is unsubscribed
            // after the first call (took me hour to figure that out).
            // https://docs.meteor.com/api/tracker.html:
            //    "Nested computations are stopped automatically when their enclosing computation is rerun"
            // This can happen when the app is initially loaded.
            this.timeoutHandle = setTimeout(() => {
                // the mobx autorun re-runs every time the conditions change for the subscription:
                this.mobxAutoRun = autorun(() => {
                    this.doSubscriptionCheckMobXConditions();
                    // since the conditions for the subscription have changed, we need to (re-)run the meteor subscription
                    if (this.subscriptionTracker) {
                        // the meteor subscription is already running, therefore let's invalidate it and re-run.
                        this.subscriptionTracker.invalidate();
                    } else {
                        this.subscriptionTracker = meteorAutorun(() => this.setSubscriptionReady(this.doSubscribe()));
                    }
                });
            }, 0);
        }
    }

    @action.bound
    private unsubscribe() {
        this.nSubscriptions--;
        // console.log('unsubscribe=', JSON.stringify({nSubscriptions:this.nSubscriptions,clazz:this.constructor.name}, null, 2));
        if (this.nSubscriptions === 0) {
            if (this.subscriptionTracker) {
                this.subscriptionTracker.stop();
                this.subscriptionTracker = undefined;
                this._isSubscriptionReady = false;
            }
            if (this.mobxAutoRun) {
                this.mobxAutoRun();
                delete this.mobxAutoRun;
            }
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = undefined;
            }
        }
    }

    @action.bound
    private setSubscriptionReady(isReady: boolean) {
        this._isSubscriptionReady = isReady;
    }

    /**
     * This must check all mobx dependencies that are needed to update the meteor subscription
     */
    protected abstract doSubscriptionCheckMobXConditions(): void;

    /**
     * Calls the meteor subscriptions...
     * @returns  true if the subscription is ready
     */
    protected abstract doSubscribe(): boolean;
}
