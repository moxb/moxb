import { Application } from './Application';
import { Action, BindImpl, Bool, Confirm, ConfirmImpl, ManyOf, ManyOfImpl } from '@moxb/moxb';
import { BindActionButtonImpl, BoolImpl } from '@moxb/moxb';
import { action, observable } from 'mobx';

export class ApplicationImpl implements Application {
    @observable showCheckbox: boolean;
    @observable manyChoices: any[];
    readonly allChoices:{ label:string; value:string }[];

    readonly testAction: Action = new BindActionButtonImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: ()=> { alert('Hello Button')},
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
        onSave: () => {}
    });

    @action.bound
    setShowCheckbox(show: boolean) {
        this.showCheckbox = show;
    }

    constructor() {
        this.showCheckbox = false;
        this.manyChoices = [];

        this.allChoices = [
            { label: 'Banana', value: 'b'},
            { label: 'Apples', value: 'a'},
            { label: 'Peaches', value: 'p'},
        ]
    }

    newConfirmAction() {
        return new BindActionButtonImpl({
            id: 'ApplicationImpl.actionConfirm',
            label: 'Show confirm window',
            fire: () => this.showConfirmDialog(),
        });
    }

    @action
    private showConfirmDialog() {
        this.testConfirm.show();
    }
}
