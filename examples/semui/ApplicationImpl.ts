import { Application } from './Application';
import { Action } from '@moxb/moxb';
import { BindActionButtonImpl } from '@moxb/moxb';

export class ApplicationImpl implements Application {
    readonly bindAction: Action = new BindActionButtonImpl({
        id: 'ApplicationImpl.testButton',
        label: 'Hello Button',
        fire: ()=> { alert('Hello Button')},
    });
}
