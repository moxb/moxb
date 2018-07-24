import { Application } from './Application';
import { Action } from '@moxb/moxb';
import { ActionImpl } from '@moxb/moxb';

export class ApplicationImpl implements Application {
    readonly testAction: Action = new ActionImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: ()=> { alert('Hello Button')},
    });

    constructor() {
    }
}
