import { Application } from './Application';
import { Action, Bool } from '@moxb/moxb';
import { BindActionButtonImpl, BoolImpl } from '@moxb/moxb';
import { action, observable } from 'mobx';

export class ApplicationImpl implements Application {
    @observable showCheckbox: boolean;

    readonly testAction: Action = new BindActionButtonImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: ()=> { alert('Hello Button')},
    });

    readonly testBool: Bool = new BoolImpl({
        id: 'ApplicationImpl.testBool',
        label: 'Click the checkbox to toggle a boolean state',
        getValue: () => this.showCheckbox,
        setValue: this.setShowCheckbox,
    });

    @action.bound
    setShowCheckbox(show: boolean) {
        this.showCheckbox = show;
    }

    constructor() {
        this.showCheckbox = false;
    }
}
