import { Application } from './Application';
import {
    Action,
    BindImpl,
    Bool,
    Confirm,
    ConfirmImpl,
    ManyOf,
    ManyOfImpl,
    Modal,
    ModalImpl,
    Numeric,
    NumericImpl,
    OneOfImpl,
    Table,
    TableColumnImpl,
    TableImpl,
    TableSearch,
    TableSearchImpl,
    Text,
    TextImpl,
} from '@moxb/moxb';
import { ActionButtonImpl, BoolImpl } from '@moxb/moxb';
import { action, observable } from 'mobx';

export class ApplicationImpl implements Application {
    @observable showCheckbox: boolean;
    @observable manyChoices: any[];
    @observable data: { _id: string; email: string; fullName: string; createdAt: string }[];
    readonly allChoices: { label: string; value: string }[];

    readonly testAction: Action = new ActionButtonImpl({
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
        confirm: () => alert('You confirmed the action'),
    });

    readonly testManyOf: ManyOf = new ManyOfImpl({
        id: 'ApplicationImpl.testManyOf',
        label: 'Choose your snack',
        choices: () => this.allChoices,
        initialValue: () => this.manyChoices,
        onSave: () => {},
    });

    readonly testText: Text = new TextImpl({
        id: 'ApplicationImpl.name',
        initialValue: () => '',
        label: 'Name',
    });

    readonly testTextfield: Text = new TextImpl({
        id: 'ApplicationImpl.textfield',
        initialValue: () => '',
        label: 'Textfield',
    });

    readonly testTextarea: Text = new TextImpl({
        id: 'ApplicationImpl.textarea',
        initialValue: () => '',
        control: 'textarea',
        label: 'Textarea',
    });

    readonly action1Modal: Action = new ActionButtonImpl({
        id: 'ApplicationImpl.modalAction1',
        label: 'Action with value',
        fire: () => {
            alert(`Action executed with value: ${this.testText.value!}`);
        },
    });

    private actionCancelModal(modal: Modal<any>): Action {
        return new ActionButtonImpl({
            id: 'ApplicationImpl.cancelModalButton',
            label: 'Cancel',
            fire: () => modal.close(),
        });
    }

    readonly testModal: Modal<any> = new ModalImpl<any>({
        actions: () => [this.action1Modal, this.actionCancelModal(this.testModal)],
        size: 'small',
        header: () => 'New Modal Header',
    });

    readonly testNumeric: Numeric = new NumericImpl({
        id: 'ApplicationImpl.number',
        onlyInteger: true,
        initialValue: 999,
        label: 'Only numbers',
    });

    readonly testOfOne = new OneOfImpl({
        id: 'ApplicationImpl.testRadioOfOne',
        label: 'Select one of',
        placeholder: '...',
        choices: () => this.allChoices,
    });

    readonly testTable: Table<any> = new TableImpl<any>({
        id: 'table',
        data: () => this.data,
        columns: bind => [
            new TableColumnImpl(
                {
                    id: 'emails',
                    label: 'E-Mail',
                    preferredSortDirection: 'ascending',
                },
                bind
            ),
            new TableColumnImpl(
                {
                    id: 'fullName',
                    label: 'Full Name',
                    preferredSortDirection: 'ascending',
                },
                bind
            ),
            new TableColumnImpl(
                {
                    id: 'createdAt',
                    label: 'Joined',
                    preferredSortDirection: 'ascending',
                },
                bind
            ),
        ],
    });

    readonly search: TableSearch = new TableSearchImpl();

    @action.bound
    setShowCheckbox(show: boolean) {
        this.showCheckbox = show;
    }

    @action.bound
    private showModalDialog() {
        this.testModal.show();
    }

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
        ];
    }

    newConfirmAction() {
        return new ActionButtonImpl({
            id: 'ApplicationImpl.actionConfirm',
            label: 'Show confirm dialog',
            fire: () => this.showConfirmDialog(),
        });
    }

    newModalAction() {
        return new ActionButtonImpl({
            id: 'ApplicationImpl.actionModal',
            label: 'Show modal dialog',
            fire: () => this.showModalDialog(),
        });
    }

    @action
    private showConfirmDialog() {
        this.testConfirm.show();
    }
}
