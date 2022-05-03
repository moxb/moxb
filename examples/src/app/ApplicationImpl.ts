import {
    Action,
    ActionImpl,
    BindImpl,
    BindOneOfChoice,
    Bool,
    BoolImpl,
    Confirm,
    ConfirmImpl,
    Date,
    DateImpl,
    Form,
    FormImpl,
    Label,
    LabelImpl,
    ManyOf,
    ManyOfImpl,
    Modal,
    ModalImpl,
    Numeric,
    NumericImpl,
    OneOfImpl,
    Progress,
    ProgressImpl,
    Rate,
    RateImpl,
    t,
    Table,
    TableColumnImpl,
    TableImpl,
    Text,
    TextImpl,
    Time,
    TimeImpl,
    ValueImpl,
    Value,
    ValueOptions,
    Tree,
    TreeImpl,
    TreeNode,
} from '@moxb/moxb';
import { action, observable, computed, makeObservable } from 'mobx';
import { Application, ApplicationAPI } from './Application';
import { ApplicationMethods } from './ApplicationMethods';

const moment = require('moment');

export class ApplicationImpl implements Application {
    @observable
    showCheckbox: boolean;
    @observable
    manyChoices: any[];
    @observable
    data: { _id: string; email: string; fullName: string; createdAt: string }[];
    readonly allChoices: BindOneOfChoice[];
    readonly treeChoices: TreeNode[];
    readonly defaultTreeChoices: string[];

    readonly testAction: Action = new ActionImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: () => {
            alert('Hello Button');
        },
    });

    readonly testLabel: Label = new LabelImpl({
        id: 'ApplicationImpl.testLabel',
        text: '<h2>LALALAL</h2>',
        showRawText: false,
    });

    readonly testLabelMarkdown: Label = new LabelImpl({
        id: 'ApplicationImpl.testLabel2',
        text: '# Hello Button',
        showRawText: false,
    });

    readonly testBool: Bool = new BoolImpl({
        id: 'ApplicationImpl.testBool',
        label: 'Click on this widget to toggle a boolean state',
        help: 'If you do so, a secret will be revealed!',
        getValue: () => this.showCheckbox,
        setValue: (value) => this.setShowCheckbox(value),
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

    readonly testTree: Tree = new TreeImpl({
        id: 'ApplicationImpl.testTree',
        label: 'Select items',
        nodes: () => this.treeChoices,
        expandValues: () => true,
        onSave: () => {},
        initialValue: () => this.defaultTreeChoices,
    });

    @computed
    get testTreeSelection(): string {
        const { value } = this.testTree;
        return value === undefined ? 'undefined' : value.map((v) => '"' + v + '"').join(', ');
    }

    readonly testTextField: Text = new TextImpl({
        id: 'ApplicationImpl.textField',
        initialValue: () => '',
        label: 'Textinput',
        control: 'input',
    });

    readonly testTextarea: Text = new TextImpl({
        id: 'ApplicationImpl.textarea',
        initialValue: () => '',
        control: 'textarea',
        label: 'Textarea',
    });

    readonly testNumeric: Numeric = new NumericImpl({
        id: 'ApplicationImpl.number',
        onlyInteger: true,
        initialValue: 999,
        label: 'Only numbers',
        unit: '€',
        required: true,
        onExitField: (bind) => {
            if (bind.value! < 900) {
                bind.setError(t('ApplicationImpl.numeric.error', 'The number must be greater than 900!'));
            }
        },
    });

    readonly testRate: Rate = new RateImpl({
        id: 'ApplicationImpl.rate',
        count: 4,
        allowClear: true,
        tooltips: ['rookie', 'sergeant', 'captain', 'colonel'],
        showValueLabel: true,
        initialValue: 2,
    });

    readonly testSliderNumeric: Numeric = new NumericImpl({
        id: 'ApplicationImpl.sliderNumber',
        onlyInteger: false,
        initialValue: 1,
        label: 'Number set by slider',
        min: 0.05,
        max: 2,
        step: 0.05,
        required: true,
        unit: 'm',
    });

    readonly testProgress: Progress = new ProgressImpl({
        id: 'ApplicationImpl.progress',
        initialValue: 80,
        status: () => {
            if ((this.testProgress.value || 0) <= 30) {
                return 'exception';
            } else if ((this.testProgress.value || 0) >= 90) {
                return 'success';
            } else {
                return 'active';
            }
        },
    });

    readonly decreaseLineProgress = new ActionImpl({
        id: 'ApplicationImpl.progress.decrease',
        label: '- 10%',
        fire: () => {
            this.testProgress.setValue(Math.max((this.testProgress.value || 0) - 10, 0));
        },
    });

    readonly increaseLineProgress = new ActionImpl({
        id: 'ApplicationImpl.progress.increase',
        label: '+ 10%',
        fire: () => {
            this.testProgress.setValue(Math.min((this.testProgress.value || 0) + 10, 100));
        },
    });

    readonly testProgress2: Progress = new ProgressImpl({
        id: 'ApplicationImpl.progress2',
        initialValue: 75,
        type: 'circle',
    });

    readonly decreaseCircleProgress = new ActionImpl({
        id: 'ApplicationImpl.progress2.decrease',
        label: '-',
        fire: () => {
            this.testProgress2.setValue(Math.max((this.testProgress2.value || 0) - 5, 0));
        },
    });

    readonly increaseCircleProgress = new ActionImpl({
        id: 'ApplicationImpl.progress2.increase',
        label: '+',
        fire: () => {
            this.testProgress2.setValue(Math.min((this.testProgress2.value || 0) + 5, 100));
        },
    });

    readonly testOfOne = new OneOfImpl({
        id: 'ApplicationImpl.testRadioOfOne',
        label: 'Select one of',
        placeholder: '...',
        choices: () => this.allChoices,
        searchData: (value) =>
            this.allChoices.filter((c) => c.label && c.label.toLowerCase().indexOf(value.toLowerCase()) > -1),
    });

    readonly testModal: Modal<any> = new ModalImpl<any>({
        actions: () => ({
            confirm: this.action1Modal,
            cancel: this.actionCancelModal(this.testModal),
        }),
        header: () => 'New Modal Header',
    });

    readonly testTags: Value<{}> = new ValueImpl<{}, string[], ValueOptions<{}, string[]>>({
        id: 'ApplicationImpl.testTags',
        initialValue: () => ['Unremovable', 'Tag 2', 'Tag 3'],
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
        required: true,
        placeholder: () => 'Username',
        onExitField: (bind) => {
            if (bind.value !== '' && bind.value!.length < 3) {
                bind.setError(t('ApplicationImpl.login.name', 'Username is too short, min. 3 characters.'));
            }
        },
        onSave: (bind, done) => this.api.saveName(bind.value!, done),
    });

    readonly formPasswordText: Text = new TextImpl({
        id: 'ApplicationImpl.formPasswordText',
        initialValue: () => '',
        label: 'Password',
        placeholder: () => 'Password',
        help: () => 'Help me with this text.',
        onExitField: (bind) => {
            if (bind.value !== '' && bind.value!.length < 4) {
                bind.setError(t('ApplicationImpl.login.password', 'Password must have at least 3 characters.'));
            }
        },
        onSave: (bind, done) => this.api.savePassword(bind.value!, done),
    });

    readonly formSubmitButton: Action = new ActionImpl({
        id: 'ApplicationImpl.formSubmitButton',
        label: 'Log in',
        fire: () => {},
    });
    readonly testForm: Form = new FormImpl({
        id: 'ApplicationImpl.testForm',
        values: [this.formUserText, this.formPasswordText],
        onSubmit: (_, done) => this.api.submitLogin(this.formUserText.value!, this.formPasswordText.value!, done),
    });

    readonly testTable: Table<any> = new TableImpl<any>({
        id: 'table',
        data: (tab) => tab.sort.sortData(this.data),
        columns: (bind) => [
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

    @action
    testDateChange() {
        this.testDate.setValue(moment('2014-12-31T23:00:00.000Z'));
    }

    readonly testDate: Date = new DateImpl({
        id: 'ApplicationImpl.testDate',
        placeholder: () => 'Deadline',
    });

    readonly testTime: Time = new TimeImpl({
        id: 'ApplicationImpl.testTime',
    });

    constructor(private readonly api: ApplicationAPI = new ApplicationMethods()) {
        makeObservable(this);
        this.showCheckbox = false;

        this.manyChoices = [];

        this.allChoices = [
            {
                label: 'Banana',
                value: 'b',
                help: 'You know, the yellow thing that monkeys like',
            },
            {
                label: 'Apples',
                value: 'a',
                help: "Warning: you can't compare apples to peaches!",
            },
            { label: 'Peaches', value: 'p' },
            {
                label: 'Magic Mushroom',
                value: 'm',
                disabled: true,
                reason: "It doesn't exist",
            },
        ];

        this.data = [
            {
                _id: '1',
                email: 'john@doe.com',
                fullName: 'John Doe',
                createdAt: '2018-01-01',
            },
            {
                _id: '2',
                email: 'johanna@yahoo.com',
                fullName: 'Johanna Doe',
                createdAt: '2018-05-01',
            },
            {
                _id: '3',
                email: 'jake@gmail.com',
                fullName: 'Jake Doe',
                createdAt: '2018-10-01',
            },
            {
                _id: '4',
                email: 'max@mustermann.com',
                fullName: 'Max Mustermann',
                createdAt: '2017-13-07',
            },
        ];

        this.treeChoices = [
            {
                key: 'fruits',
                title: 'Fruits',
                children: [
                    { key: 'apple', title: 'Apple' },
                    { key: 'banana', title: 'Banana' },
                    { key: 'kiwi', title: 'Kiwi' },
                    { key: 'peach', title: 'Peach' },
                ],
            },
            {
                key: 'vegetables',
                title: 'Vegetables',
                children: [
                    {
                        key: 'cooked',
                        title: 'Cooked',
                        children: [
                            { key: 'grain', title: 'Grain' },
                            { key: 'potato', title: 'Potato' },
                            { key: 'rice', title: 'Rice' },
                        ],
                    },
                    {
                        key: 'raw',
                        title: 'Raw',
                        children: [
                            { key: 'carrot', title: 'Carrot' },
                            { key: 'onion', title: 'Onion' },
                            { key: 'tomato', title: 'Tomato' },
                        ],
                    },
                ],
            },
        ];

        this.defaultTreeChoices = ['apple', 'carrot'];
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
