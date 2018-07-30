import { Action, Bool } from '@moxb/moxb';

export interface Application {
    readonly showCheckbox: boolean;
    readonly testAction: Action;
    readonly testBool: Bool;
}
