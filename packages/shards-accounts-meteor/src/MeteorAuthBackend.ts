import { AuthenticationBackend } from '@moxb/shards-accounts-flow-antd';

import { useMeteorUser } from '@moxb/meteor-react';

/**
 * We implement the Meteor-based login functionality in a background store object
 */
export class MeteorAuthBackend implements AuthenticationBackend {
    isLoginSituationKnown() {
        return useMeteorUser() !== undefined;
    }

    isLoggedIn() {
        return !!useMeteorUser();
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
