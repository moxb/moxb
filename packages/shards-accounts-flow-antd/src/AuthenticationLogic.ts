import type { LocationManager } from '@moxb/stellar-router-core';

/**
 * This interface describes the Authentication Logic singleton component
 *
 * ... that can provide data for authentication-related components.
 */
export interface AuthenticationLogic {
    /**
     * Do we know if the user is logged in?
     */
    readonly isLoginStatusKnown: boolean;

    /**
     * Is the user logged in?
     */
    readonly isLoggedIn: boolean;

    /**
     * User-readable user name
     */
    readonly username?: string;

    /**
     * Any message to display on the forgot password form
     */
    readonly forgotMessage?: string;

    /**
     * Any error message for the forgot password form
     */
    readonly forgotErrorMessage?: string;

    /**
     * Are we currently trying to trigger the forgot password workflow?
     */
    readonly isForgotPending: boolean;

    /**
     * Clean the forgot password form
     */
    cleanForgotForm(): void;

    /**
     * Trigger a "forgotten password" action (on the auth backend)
     */
    triggerForgot(email: string): void;

    /**
     * Any error message for the password reset form
     */
    readonly resetErrorMessage?: string;

    /**
     * Are we currently trying to execute a password reset?
     */
    readonly isResetPending: boolean;

    /**
     * Clean the password reset form
     */
    cleanResetForm(): void;

    /**
     * Trigger a password reset (on the auth backend)
     */
    triggerPasswordReset(token: string, password1: string, password2: string): void;

    /**
     * Clean the login form
     */
    cleanLoginForm(): void;

    /**
     * Login error to show
     */
    readonly loginErrorMessage?: string;

    /**
     * Are we trying to log in?
     */
    readonly isLoginPending: boolean;

    /**
     * Trigger the login process (on the auth backend)
     */
    triggerLogin(username: string, password: string): void;

    /**
     * Any error message to display on the registration form
     */
    readonly registrationErrorMessage?: string;

    /**
     * Any message to display on the registration form
     */
    readonly isRegistrationPending: boolean;

    /**
     * Clean the registration form
     */
    cleanRegistrationForm(): void;

    /**
     * Trigger user registration (on the auth backend)
     */
    triggerRegistration(username: string, password1: string, password2: string): void;

    /**
     * Log out (via the auth backend)
     */
    triggerLogout(): void;

    /**
     * Inject the routing host to the auth logic.
     *
     * (This is an implementation detail, shouldn't be used by actual applications)
     */
    _injectLocationManager(locationManager: LocationManager): void;
}
