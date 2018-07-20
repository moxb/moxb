import { Action, Bool, Confirm, ManyOf } from '@moxb/moxb';

export interface Application {
    readonly showCheckbox: boolean;
    newConfirmAction(): Action;
    readonly testAction: Action;
    readonly testBool: Bool;
    readonly testConfirm: Confirm<any>;
    readonly testManyOf: ManyOf;
}
