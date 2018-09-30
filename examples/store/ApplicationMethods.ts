import { MeteorCallback } from '../../packages/meteor/src';
import { ApplicationAPI } from './Application';

export class ApplicationMethods implements ApplicationAPI {
    saveName(name: string, done: MeteorCallback<void>) {
        if (name !== 'demo') {
            setTimeout(() => done(new Error('Username not correct')), 500);
        }
    }
    savePassword(password: string, done: MeteorCallback<void>) {
        if (password !== 'demo') {
            setTimeout(() => done(new Error('Password not correct')), 500);
        }
    }
    submitLogin(name: string, password: string, done: MeteorCallback<void>) {
        if (name === 'demo' && password === 'demo') {
            setTimeout(() => done(alert(`You successfully logged in with ${name} ${password}`)), 500);
        } else {
            setTimeout(() => done(new Error('Login failed! Username or password incorrect!')), 500);
        }
    }
}
