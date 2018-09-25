import { Application, ApplicationAPI } from './Application';
import {
    t,
    Action,
    Bool,
    Confirm,
    Modal,
    Text,
    Date,
    ManyOf,
    Numeric,
    Table,
    Time,
    Form,
    ActionImpl,
    BoolImpl,
    ConfirmImpl,
    BindImpl,
    ModalImpl,
    TextImpl,
    ManyOfImpl,
    NumericImpl,
    OneOfImpl,
    TableImpl,
    TableColumnImpl,
    DateImpl,
    TimeImpl,
    FormImpl,
} from '@moxb/moxb';
import { action, observable } from 'mobx';
import { ApplicationMethods } from './ApplicationMethods';

export class ApplicationImpl implements Application {
    @observable
    showCheckbox: boolean;
    @observable
    manyChoices: any[];
    @observable
    data: { _id: string; email: string; fullName: string; createdAt: string }[];
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

    readonly testTextfield: Text = new TextImpl({
        id: 'ApplicationImpl.textfield',
        initialValue: () => '',
        label: 'Textfield',
        inputType: 'text',
    });

    readonly testTextarea: Text = new TextImpl({
        id: 'ApplicationImpl.textarea',
        initialValue: () => '',
        inputType: 'textarea',
        label: 'Textarea',
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

    readonly formUserText: Text = new TextImpl({
        id: 'ApplicationImpl.formUserText',
        initialValue: () => '',
        label: 'Username',
        placeholder: () => 'Username',
        onExitField: bind => {
            if (bind.value !== '' && bind.value!.length < 3) {
                bind.setError(t('ApplicationImpl.login.name', 'Username is too short, min. 3 characters.'));
            }
        },
        onSave: (bind, done) => this.api.saveName(bind.value!, bind, done),
    });

    readonly formPasswordText: Text = new TextImpl({
        id: 'ApplicationImpl.formPasswordText',
        initialValue: () => '',
        label: 'Password',
        placeholder: () => 'Password',
        help: () => 'Help me with this text.',
        onExitField: bind => {
            if (bind.value !== '' && bind.value!.length < 7) {
                bind.setError(t('ApplicationImpl.login.password', 'Password must have at least 6 characters.'));
            }
        },
        onSave: (bind, done) => this.api.savePassword(bind.value!, bind, done),
    });

    readonly formSubmitButton: Action = new ActionImpl({
        id: 'ApplicationImpl.formSubmitButton',
        label: 'Log in',
        fire: () => {},
    });
    readonly testForm: Form = new FormImpl({
        id: 'ApplicationImpl.testForm',
        values: [this.formUserText, this.formPasswordText],
    });

    readonly testTable: Table<any> = new TableImpl<any>({
        id: 'table',
        data: tab => tab.sort.sortData(this.data),
        columns: bind => [
            new TableColumnImpl(
                {
                    id: 'email',
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
                    preferredSortDirection: 'descending',
                },
                bind
            ),
        ],
    });

    readonly testDate: Date = new DateImpl({
        id: 'ApplicationImpl.testDate',
        placeholder: () => 'Deadline',
    });

    readonly testTime: Time = new TimeImpl({
        id: 'ApplicationImpl.testTime',
        placeholder: () => 'Select a time',
    });

    constructor(private readonly api: ApplicationAPI = new ApplicationMethods()) {
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
