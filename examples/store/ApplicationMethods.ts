import { MeteorCallback } from '../../packages/meteor/src';
import { ApplicationAPI } from './Application';

export class ApplicationMethods implements ApplicationAPI {
    saveName(name: string, bind: any, done: MeteorCallback<void>) {
        if (name !== 'demo') {
            bind.setError('Username not correct');
        } else {
            console.log('Username correct!!!');
        }
    }
    savePassword(password: string, bind: any, done: MeteorCallback<void>) {
        if (password !== 'demo') {
            bind.setError('Password not correct');
        } else {
            console.log('Password correct!!!');
        }
    }
}
