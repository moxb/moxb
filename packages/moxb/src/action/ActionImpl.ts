import { action, computed, makeObservable, observable } from 'mobx';
import { BindImpl, BindOptions, getValueOrFunction, ValueOrFunction } from '../bind/BindImpl';
import { Action } from './Action';

export interface ActionOptions extends BindOptions {
    confirmQuestion?: ValueOrFunction<string>;

    fire(): Promise<any> | void;

    pending?: () => boolean;
    readonly keyboardShortcuts?: string | string[];
}

export class ActionImpl extends BindImpl<ActionOptions> implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
        makeObservable(this);
    }

    get confirmQuestion() {
        return getValueOrFunction(this.impl.confirmQuestion);
    }

    protected getPending() {
        return (this.impl.pending ? this.impl.pending() : false) || this._promisePending;
    }

    get pending() {
        return this.getPending();
    }

    @computed
    get keyboardShortcuts() {
        if (!this.impl.keyboardShortcuts) {
            return [];
        }
        if (typeof this.impl.keyboardShortcuts === 'string') {
            return [this.impl.keyboardShortcuts];
        }
        return this.impl.keyboardShortcuts;
    }

    @observable
    _promisePending = false;

    @action.bound
    firePromise() {
        if (!this.enabled) {
            const problem = `cannot fire disabled action ${this.id} '${this.label}': ${this.reason}`;
            console.warn(problem);
            return Promise.reject(problem);
        }
        if (this.pending) {
            const problem = `cannot fire pending action ${this.id} '${this.label}'`;
            console.warn(problem);
            return Promise.reject(problem);
        }
        this.clearErrors();
        const promise = new Promise<void>(
            action((resolve, reject) => {
                this._promisePending = true;
                try {
                    const firing = this.impl.fire();
                    if (firing) {
                        // The execution has returned a promise, so we can use that to track process.
                        firing.then(resolve, reject);
                    } else {
                        // No promise was returned, so we will assume that a successful execution mean that we are done.
                        resolve();
                    }
                } catch (error) {
                    // We couldn't even fire this, so it's an instant fail
                    reject(error);
                }
            })
        );
        promise.catch((error) => {
            this.setError(error.reason || error.error || error.toString());
        });
        promise.finally(
            action(() => {
                this._promisePending = false;
            })
        );
        return promise;
    }

    @action.bound
    fire() {
        this.firePromise().then(
            () => {
                // This is intentional
            },
            () => {
                // this is intentional
            }
        );
    }
}

export class ActionButtonImpl extends ActionImpl implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }
}
