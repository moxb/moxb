import { Action, Bool, Confirm, Modal, Text, ManyOf, Numeric, OneOf, Table } from '@moxb/moxb';

export interface Application {
    readonly showCheckbox: boolean;
    newConfirmAction(): Action;
    newModalAction(): Action;
    readonly testAction: Action;
    readonly testBool: Bool;
    readonly testConfirm: Confirm<any>;
    readonly testModal: Modal<any>;
    readonly testText: Text;
    readonly testManyOf: ManyOf;
    readonly testTextfield: Text;
    readonly testTextarea: Text;
    readonly testNumeric: Numeric;
    readonly formUserText: Text;
    readonly formPasswordText: Text;
    readonly formRememberBool: Bool;
    readonly formSubmitButton: Action;
    readonly testOfOne: OneOf;
    readonly testTable: Table<any>;
}
