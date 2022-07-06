/**
 * The functionality that an Authentication Backend needs to provide.
 */
export interface AuthenticationBackend {
    /**
     * Do we know if this session is logged in?
     *
     * Please note that this value should be mobx-observable.
     */
    readonly isLoginSituationKnown: boolean;

    /**
     * Is this session logged in? (as far as we know)
     *
     * Please note that this value should be mobx-observable.
     */
    readonly isLoggedIn: boolean;

    /**
     * Start the "forgotten password" process.
     *
     * It should eventually email a link with a reset token or something like that.
     */
    forgotPassword(email: string): Promise<string | undefined>;

    /**
     * Execute a password reset
     */
    resetPassword(token: string, password: string): Promise<string | undefined>;

    /**
     * Attempt to authenticate the session
     */
    login(email: string, password: string): Promise<void>;

    /**
     * Register a new user
     */
    registerUser(email: string, password: string): Promise<void>;

    /**
     * Close down an authenticated session
     */
    logout(): void;
}
