import { Application } from './Application';
import { Action, Bool, Confirm, Modal, Text } from '@moxb/moxb';
import { ActionImpl, BoolImpl, ConfirmImpl, BindImpl, ModalImpl, TextImpl } from '@moxb/moxb';
import { action, observable } from 'mobx';

export class ApplicationImpl implements Application {
    @observable showCheckbox: boolean;

    readonly testAction: Action = new ActionImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: () => {
            alert('Hello Button');
        },
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
        header: () => 'Confirm dialog',
        confirm: () => alert('You confirmed the action'),
    });

    readonly testModal: Modal<any> = new ModalImpl<any>({
        actions: () => [this.action1Modal, this.actionCancelModal(this.testModal)],
        header: () => 'New Modal Header',
    });

    readonly action1Modal: Action = new ActionImpl({
        id: 'ApplicationImpl.modalAction1',
        label: 'Action with value',
        fire: () => {
            alert(`Action executed with value: ${this.testText.value!}`);
        },
    });

    private actionCancelModal(modal: Modal<any>): Action {
        return new ActionImpl({
            id: 'ApplicationImpl.cancelModalButton',
            label: 'Cancel',
            fire: () => modal.close(),
        });
    }

    readonly testText: Text = new TextImpl({
        id: 'ApplicationImpl.name',
        initialValue: () => '',
        placeholder: () => 'Enter a value for later processing...',
        label: 'Name',
    });

    constructor() {
        this.showCheckbox = false;
    }

    newConfirmAction() {
        return new ActionImpl({
            id: 'ApplicationImpl.actionConfirm',
            label: 'Show confirm dialog',
            fire: () => this.testConfirm.show(),
        });
    }

    newModalAction() {
        return new ActionImpl({
            id: 'ApplicationImpl.actionModal',
            label: 'Show modal dialog',
            fire: () => this.testModal.show(),
        });
    }

    @action.bound
    setShowCheckbox(show: boolean) {
        this.showCheckbox = show;
    }
}
