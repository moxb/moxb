import { action } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Action } from './Action';

export interface ActionOptions extends BindOptions {
    fire(): void;
    pending?: () => boolean;
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

    @action.bound
    fire() {
        if (this.enabled) {
            if (this.pending) {
                console.warn(`cannot fire pending action ${this.id} '${this.label}'`);
            } else {
                this.impl.fire();
            }
        } else {
            console.warn(`cannot fire disabled action ${this.id} '${this.label}'`);
        }
    }
}

export class ActionButtonImpl extends ActionImpl implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }
}
