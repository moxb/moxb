import { makeObservable, observable } from 'mobx';
import { AuthBackend } from '@moxb/shards-accounts-flow';
import { useMeteorLoggingIn, useMeteorUser } from '@moxb/meteor-react';

/**
 * We implement the Meteor-based login functionality in a background store object
 */
export class MeteorAuthBackend implements AuthBackend {
    constructor() {
        makeObservable(this);
    }

    useAuthStatus() {
        const user = useMeteorUser();
        const isLoginStatusKnown = user !== undefined;
        return {
            isLoginStatusKnown,
            isLoggedIn: !!user,
        };
    }

    @observable
    forgotPending = false;

    @observable
    forgotErrorMessage: string | undefined;

    @observable
    forgotMessage: string | undefined;

    useForgotStatus() {
        return {
            isForgotPending: this.forgotPending,
            forgotErrorMessage: this.forgotErrorMessage,
            forgotMessage: this.forgotMessage,
        };
    }

    triggerForgot(email: string) {
        this.forgotMessage = undefined;
        this.forgotErrorMessage = undefined;
        this.forgotPending = true;
        Accounts.forgotPassword({ email }, (forgotError: any) => {
            this.forgotPending = false;

            if (forgotError) {
                this.forgotErrorMessage = forgotError.reason || 'Failed to initiate password reset';
            } else {
                this.forgotMessage = 'Email sent. Please check your email.';
            }
        });
    }

    @observable
    resetPending = false;

    @observable
    resetErrorMessage: string | undefined;

    useResetStatus() {
        return {
            isResetPending: this.resetPending,
            resetErrorMessage: this.resetErrorMessage,
        };
    }

    triggerPasswordReset(token: string, password1: string, password2: string) {
        if (!token) {
            this.resetErrorMessage = 'This link is invalid. Please restart the process.';
            return;
        }
        if (password1 !== password2) {
            this.resetErrorMessage = "The two passwords don't match!";
            return;
        }
        this.resetErrorMessage = undefined;
        this.resetPending = true;
        Accounts.resetPassword(token, password1, (resetError: any) => {
            this.resetPending = false;
            this.resetErrorMessage = resetError?.reason;
        });
    }

    @observable
    loginErrorMessage: string | undefined;

    useLoginStatus() {
        return {
            isLoginPending: useMeteorLoggingIn(),
            loginErrorMessage: this.loginErrorMessage,
        };
    }

    triggerLogin(username: string, password: string) {
        this.loginErrorMessage = undefined;
        Meteor.loginWithPassword(username, password, (loginError: any) => {
            this.loginErrorMessage = loginError?.reason;
        });
    }

    @observable
    registrationPending = false;

    @observable
    registrationErrorMessage: string | undefined;

    useRegistrationStatus() {
        return {
            isRegistrationPending: this.registrationPending,
            registrationErrorMessage: this.registrationErrorMessage,
        };
    }

    triggerRegistration(email: string, password1: string, password2: string) {
        // console.log('Should register with', email, password1, password2);
        if (password1 !== password2) {
            this.registrationErrorMessage = "The two passwords don't match!";
            return;
        }
        this.registrationErrorMessage = undefined;
        this.registrationPending = true;
        Accounts.createUser(
            {
                username: email,
                email,
                password: password1,
            },
            (createError: any) => {
                this.registrationPending = false;
                this.registrationErrorMessage = createError?.reason;
            }
        );
    }

    triggerLogout() {
        Meteor.logout();
    }
}
