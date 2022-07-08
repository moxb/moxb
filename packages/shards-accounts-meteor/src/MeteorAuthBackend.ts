import { action, makeObservable, observable } from 'mobx';
import { Tracker } from 'meteor/tracker';
import { AuthenticationBackend } from '@moxb/shards-accounts-flow-antd';

/**
 * We implement the Meteor-based login functionality in a background store object
 */
export class MeteorAuthBackend implements AuthenticationBackend {
    constructor() {
        makeObservable(this);
        Tracker.autorun(() => {
            const user = Meteor.user();
            this._setLoginStatusKnown(user !== undefined);
            this._setLoggedIn(!!user);
            this._setUserName(user?.username);
        });
    }

    @observable
    _loginStatusKnown = false;

    @action
    _setLoginStatusKnown(value: boolean) {
        this._loginStatusKnown = value;
    }

    get isLoginSituationKnown() {
        return this._loginStatusKnown;
    }

    @observable
    _loggedIn = false;

    @action
    _setLoggedIn(value: boolean) {
        this._loggedIn = value;
    }

    get isLoggedIn() {
        return this._loggedIn;
    }

    @observable
    _username?: string;

    @action
    _setUserName(value: string | undefined) {
        this._username = value;
    }

    get username() {
        return this._username;
    }

    forgotPassword(email: string) {
        return new Promise<string | undefined>((resolve, reject) => {
            Accounts.forgotPassword({ email }, (forgotError: any) => {
                if (forgotError) {
                    reject(forgotError.reason);
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    resetPassword(token: string, password: string) {
        return new Promise<string | undefined>((resolve, reject) => {
            Accounts.resetPassword(token, password, (resetError: any) => {
                if (resetError) {
                    reject(resetError.reason);
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    login(email: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            Meteor.loginWithPassword(email, password, (loginError: any) => {
                if (loginError) {
                    reject(loginError.reason);
                } else {
                    resolve();
                }
            });
        });
    }

    registerUser(email: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Accounts.createUser(
                {
                    username: email,
                    email,
                    password,
                },
                (createError: any) => {
                    if (createError) {
                        reject(createError.reason);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    logout() {
        Meteor.logout();
    }
}
