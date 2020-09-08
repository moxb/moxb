import { action, computed } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Action } from './Action';

export interface ActionOptions extends BindOptions {
    fire(): Promise<void> | void;
    pending?: () => boolean;
    readonly keyboardShortcuts?: string | string[];
}

export class ActionImpl extends BindImpl<ActionOptions> implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }

    protected getPending() {
        return this.impl.pending ? this.impl.pending() : false;
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

    @action.bound
    firePromise() {
        return new Promise<void>((resolve, reject) => {
            if (this.enabled) {
                if (this.pending) {
                    const problem = `cannot fire pending action ${this.id} '${this.label}'`;
                    console.warn(problem);
                    reject(problem);
                } else {
                    const firing = this.impl.fire();
                    if (firing) {
                        firing.then(resolve, reject);
                    } else {
                        resolve();
                    }
                }
            } else {
                const problem = `cannot fire disabled action ${this.id} '${this.label}': ${this.reason}`;
                console.warn(problem);
                reject(problem);
            }
        });
    }

    fire() {
        this.firePromise().then(
            () => {},
            () => {}
        );
    }
}

export class ActionButtonImpl extends ActionImpl implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }
}
