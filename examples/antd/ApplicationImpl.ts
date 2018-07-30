import { Application } from './Application';
import { Action, Bool, Confirm, Modal, Text, ManyOf } from '@moxb/moxb';
import { ActionImpl, BoolImpl, ConfirmImpl, BindImpl, ModalImpl, TextImpl, ManyOfImpl } from '@moxb/moxb';
import { action, observable } from 'mobx';

export class ApplicationImpl implements Application {
    @observable showCheckbox: boolean;
    @observable manyChoices: any[];
    @observable data: { _id: string; email: string; fullName: string; createdAt: string }[];
    readonly allChoices: { label: string; value: string }[];

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

    readonly testManyOf: ManyOf = new ManyOfImpl({
        id: 'ApplicationImpl.testManyOf',
        label: 'Choose your snack',
        choices: () => this.allChoices,
        initialValue: () => this.manyChoices,
        placeholder: () => 'Please select',
        onSave: () => {},
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

        this.manyChoices = [];

        this.allChoices = [
            { label: 'Banana', value: 'b' },
            { label: 'Apples', value: 'a' },
            { label: 'Peaches', value: 'p' },
        ];

        this.data = [
            { _id: '1', email: 'john@doe.com', fullName: 'John Doe', createdAt: '2018-01-01' },
            { _id: '2', email: 'johanna@yahoo.com', fullName: 'Johanna Doe', createdAt: '2018-05-01' },
            { _id: '3', email: 'jake@gmail.com', fullName: 'Jake Doe', createdAt: '2018-10-01' },
            { _id: '4', email: 'max@mustermann.com', fullName: 'Max Mustermann', createdAt: '2017-13-07' },
        ];
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
