import { action, computed, makeObservable, observable } from 'mobx';
import { LocationManager } from '@moxb/stellar-router-core';
import type { AuthenticationLogic } from './AuthenticationLogic';
import type { AuthenticationBackend } from './AuthenticationBackend';

/**
 * This component implements the Authentication Logic functionality
 */
export class AuthenticationLogicImpl implements AuthenticationLogic {
    constructor(private readonly backend: AuthenticationBackend) {
        makeObservable(this);
    }

    @computed
    get isLoginStatusKnown() {
        return this.backend.isLoginSituationKnown;
    }

    @computed
    get isLoggedIn() {
        return this.backend.isLoginSituationKnown && this.backend.isLoggedIn;
    }

    @computed
    get username() {
        return this.backend.username;
    }

    @observable
    _forgotPending = false;

    get isForgotPending() {
        return this._forgotPending;
    }

    @observable
    _forgotErrorMessage: string | undefined;

    get forgotErrorMessage() {
        return this._forgotErrorMessage;
    }

    @observable
    _forgotMessage: string | undefined;

    get forgotMessage() {
        return this._forgotMessage;
    }

    @action
    cleanForgotForm() {
        this._forgotMessage = undefined;
        this._forgotErrorMessage = undefined;
    }

    @action
    triggerForgot(email: string) {
        this._forgotMessage = undefined;
        this._forgotErrorMessage = undefined;
        this._forgotPending = true;
        this.backend.forgotPassword(email).then(
            action((result) => {
                this._forgotPending = false;
                this._forgotMessage = result || 'Email sent. Please check your email.';
            }),
            action((error) => {
                this._forgotPending = false;
                this._forgotErrorMessage = error || 'Failed to initiate password reset';
            })
        );
    }

    @observable
    _resetPending = false;

    get isResetPending() {
        return this._resetPending;
    }

    @observable
    _resetErrorMessage: string | undefined;

    get resetErrorMessage() {
        return this._resetErrorMessage;
    }

    @action
    cleanResetForm() {
        this._resetErrorMessage = undefined;
    }

    @action
    triggerPasswordReset(token: string, password1: string, password2: string) {
        if (!token) {
            this._resetErrorMessage = 'This link is invalid. Please restart the process.';
            return;
        }
        if (password1 !== password2) {
            this._resetErrorMessage = "The two passwords don't match!";
            return;
        }
        this._resetErrorMessage = undefined;
        this._resetPending = true;

        this.backend.resetPassword(token, password1).then(
            action(() => {
                this._resetPending = false;
            }),
            action((error) => {
                this._resetPending = false;
                this._resetErrorMessage = error || 'Failed to reset password.';
            })
        );
    }

    @observable
    _loginPending = false;

    get isLoginPending() {
        return this._loginPending;
    }

    @action
    private _setLoginPending(value: boolean) {
        this._loginPending = value;
    }

    @observable
    _loginErrorMessage: string | undefined;

    get loginErrorMessage() {
        return this._loginErrorMessage;
    }

    @action
    private _setLoginErrorMessage(message: string | undefined) {
        this._loginErrorMessage = message;
    }

    @action
    cleanLoginForm() {
        this._setLoginErrorMessage(undefined);
    }

    @action
    triggerLogin(username: string, password: string) {
        this._setLoginErrorMessage(undefined);
        this._setLoginPending(true);
        this.backend.login(username, password).then(
            () => {
                this._setLoginPending(false);
            },
            (error) => {
                console.log('Failed to log in:', error);
                this._setLoginPending(false);
                this._setLoginErrorMessage(error);
            }
        );
    }

    @observable
    _registrationPending = false;

    get isRegistrationPending() {
        return this._registrationPending;
    }

    @observable
    _registrationErrorMessage: string | undefined;

    get registrationErrorMessage() {
        return this._registrationErrorMessage;
    }

    cleanRegistrationForm() {
        this._registrationErrorMessage = undefined;
    }

    @action
    triggerRegistration(email: string, password1: string, password2: string) {
        if (password1 !== password2) {
            this._registrationErrorMessage = "The two passwords don't match!";
            return;
        }
        this._registrationErrorMessage = undefined;
        this._registrationPending = true;

        this.backend.registerUser(email, password1).then(
            action(() => {
                this._registrationPending = false;
            }),
            action((error) => {
                this._registrationPending = false;
                this._registrationErrorMessage = error;
            })
        );
    }

    triggerLogout() {
        if (this._locationManager) {
            this._locationManager.trySetPathTokens(0, []);
        }
        this.backend.logout();
    }

    private _locationManager: LocationManager | undefined;

    _injectLocationManager(locationManager: LocationManager) {
        this._locationManager = locationManager;
    }
}
