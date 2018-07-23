import { action } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Action } from './Action';

export interface ActionOptions extends BindOptions {
    fire(): void;
}

export class ActionImpl extends BindImpl<ActionOptions> implements Action {
    constructor(impl: ActionOptions) {
        super(impl);
    }

    @action.bound
    fire() {
        if (this.enabled) {
            this.impl.fire();
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
