import { action, computed } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Action } from './Action';

export interface ActionOptions extends BindOptions {
    fire(): void;
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
    fire() {
        if (this.enabled) {
            if (this.pending) {
                console.warn(`cannot fire pending action ${this.id} '${this.label}'`);
            } else {
                this.impl.fire();
            }
        } else {
            console.warn(`cannot fire disabled action ${this.id} '${this.label}': ${this.reason}`);
        }
    }
}

export class ActionButtonImpl extends ActionImpl implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }
}
