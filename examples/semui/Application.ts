import { Action, Bool, Confirm, ManyOf, Modal, Text, Numeric, OneOf, Table, TableSearch } from '@moxb/moxb';
import { MemTable } from './memtable/MemTable';

export interface Application {
    readonly showCheckbox: boolean;
    newConfirmAction(): Action;
    newModalAction(): Action;
    readonly testAction: Action;
    readonly testBool: Bool;
    readonly testConfirm: Confirm<any>;
    readonly testManyOf: ManyOf;
    readonly testModal: Modal<any>;
    readonly testText: Text;
    readonly testTextfield: Text;
    readonly testTextarea: Text;
    readonly testNumeric: Numeric;
    readonly testOfOne: OneOf;
}
