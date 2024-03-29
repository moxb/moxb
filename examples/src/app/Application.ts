import {
    Action,
    Bool,
    Confirm,
    Date,
    Form,
    Label,
    ManyOf,
    Modal,
    Numeric,
    OneOf,
    Progress,
    Rate,
    Table,
    Text,
    Time,
    Value,
    Tree,
} from '@moxb/moxb';

export interface Application {
    readonly showCheckbox: boolean;

    newConfirmAction(): Action;

    newModalAction(): Action;

    readonly testAction: Action;
    readonly testLabel: Label;
    readonly testLabelMarkdown: Label;
    readonly testBool: Bool;
    readonly testConfirm: Confirm<any>;
    readonly testModal: Modal<any>;
    readonly testText: Text;
    readonly testDate: Date;
    readonly testTime: Time;
    readonly testManyOf: ManyOf;
    readonly testTextField: Text;
    readonly testTextarea: Text;
    readonly testNumeric: Numeric;
    readonly testSliderNumeric: Numeric;
    readonly testProgress: Progress;
    readonly decreaseLineProgress: Action;
    readonly increaseLineProgress: Action;
    readonly testProgress2: Progress;
    readonly decreaseCircleProgress: Action;
    readonly increaseCircleProgress: Action;
    readonly formUserText: Text;
    readonly formPasswordText: Text;
    readonly formSubmitButton: Action;
    readonly testOfOne: OneOf;
    readonly testRate: Rate;
    readonly testTable: Table<any>;
    readonly testForm: Form;
    readonly testTags: Value<any>;
    readonly testTree: Tree;
    readonly testTreeSelection: string;
}

export interface ApplicationAPI {
    saveName(name: string, done: Function): void;

    savePassword(password: string, done: Function): void;

    submitLogin(name: string, password: string, done: Function): void;
}
