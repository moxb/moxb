/**
 * Info about the login status of a session.
 *
 * The auth backend must be able to provide this information.
 */
export interface AuthStatus {
    isLoginStatusKnown: boolean;
    isLoggedIn: boolean;
    // isLoginPending: boolean;
}

/**
 * Info about the forgotten password process.
 *
 * The auth backend must be able to provide this information.
 */
export interface ForgotStatus {
    forgotMessage?: string;
    forgotErrorMessage?: string;
    isForgotPending: boolean;
}

/**
 * Info about the password reset process.
 *
 * The auth backend must be able to provide this information.
 */
export interface ResetStatus {
    resetErrorMessage?: string;
    isResetPending: boolean;
}

/**
 * Info about the login process.
 *
 * The auth backend must be able to provide this information.
 */
export interface LoginStatus {
    loginErrorMessage?: string;
    isLoginPending: boolean;
}

/**
 * Info about the registration process.
 *
 * The auth backend must be able to provide this information.
 */
export interface RegistrationStatus {
    registrationErrorMessage?: string;
    isRegistrationPending: boolean;
}

/**
 * This interface describes the functionality the auth backend needs to provide for the login workflow to work.
 *
 * The Auth Backend should be able to execute all these tasks, track internal state, and return information
 * in proper React hooks.
 */
export interface AuthBackend {
    /**
     * Get the auth status
     */
    useAuthStatus(): AuthStatus;

    /**
     * Get the "forgot password" status
     */
    useForgotStatus(): ForgotStatus;

    /**
     * Trigger a "forgotten password" action
     */
    triggerForgot(email: string): void;

    /**
     * Get the "password reset" status
     */
    useResetStatus(): ResetStatus;

    /**
     * Trigger a password reset
     */
    triggerPasswordReset(token: string, password1: string, password2: string): void;

    /**
     * Get the login status
     */
    useLoginStatus(): LoginStatus;

    /**
     * Trigger the login process
     */
    triggerLogin(username: string, password: string): void;

    /**
     * Get the registration status
     */
    useRegistrationStatus(): RegistrationStatus;

    /**
     * Trigger user registration
     */
    triggerRegistration(username: string, password1: string, password2: string): void;

    /**
     * Log out
     */
    triggerLogout(): void;
}
