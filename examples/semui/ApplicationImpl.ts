import { Application } from './Application';
import { Action, BindImpl, Bool, Confirm, ConfirmImpl } from '@moxb/moxb';
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

    readonly testConfirm: Confirm<any> = new ConfirmImpl<any>({
        cancelButton: new BindImpl({
            id: 'ApplicationImpl.noConfirm',
            label: 'Cancel',
        }),
        confirmButton: new BindImpl({
            id: 'ApplicationImpl.yesConfirm',
            label: 'Do the action',
        }),
        content: () => 'Do you really want to execute the action?',
        confirm: () => alert('You confirmed the action'),
    });

    @action.bound
    setShowCheckbox(show: boolean) {
        this.showCheckbox = show;
    }

    constructor() {
        this.showCheckbox = false;
    }

    newConfirmAction() {
        return new BindActionButtonImpl({
            id: 'ApplicationImpl.actionConfirm',
            label: 'Show confirm window',
            fire: () => this.showConfirmDialog(),
        });
    }

    @action
    private showConfirmDialog() {
        this.testConfirm.show();
    }
}
