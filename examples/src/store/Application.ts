import { Action, Bool, Confirm, Modal, Text, ManyOf, Numeric, OneOf, Table, Date, Time, Form } from '@moxb/moxb';

export interface Application {
    readonly showCheckbox: boolean;
    newConfirmAction(): Action;
    newModalAction(): Action;
    readonly testAction: Action;
    readonly testBool: Bool;
    readonly testConfirm: Confirm<any>;
    readonly testModal: Modal<any>;
    readonly testText: Text;
    readonly testDate: Date;
    readonly testTime: Time;
    readonly testManyOf: ManyOf;
    readonly testTextfield: Text;
    readonly testTextarea: Text;
    readonly testNumeric: Numeric;
    readonly formUserText: Text;
    readonly formPasswordText: Text;
    readonly formSubmitButton: Action;
    readonly testOfOne: OneOf;
    readonly testTable: Table<any>;
    readonly testForm: Form;
}

export interface ApplicationAPI {
    saveName(name: string, done: Function): void;
    savePassword(password: string, done: Function): void;
    submitLogin(name: string, password: string, done: Function): void;
}
