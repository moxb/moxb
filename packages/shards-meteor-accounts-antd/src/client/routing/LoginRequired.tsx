import * as React from 'react';

import type { UIFragment } from '@moxb/react-html';
import { MyLocation, StateSpace, UrlArg, LocationDependentArea, redirect } from '@moxb/stellar-router-react';
import { useMeteorUser } from '@moxb/meteor-react';

import { LoginForm } from '../ui/LoginForm';
import { RegistrationForm } from '../ui/RegistrationForm';
import { ForgotPasswordForm } from '../ui/ForgotPasswordForm';
import { PasswordResetForm } from '../ui/PasswordResetForm';
import { PATH } from '../../api/paths';

interface LoginRequiredProps {
    children: JSX.Element;
    splash?: UIFragment;
    redirectArg: UrlArg<MyLocation | null>;
}

export function LoginRequired(props: LoginRequiredProps) {
    const { splash, redirectArg, children } = props;

    const user = useMeteorUser();
    if (user === undefined) {
        // Still checking the user, just don't show anything
        return null;
    }

    // Are we logged in?
    const loggedIn = !!user;

    const redirectToApp = () => {
        const savedRedirect = redirectArg.value;
        return redirect(savedRedirect ? { location: savedRedirect } : { to: [] });
    };

    const loginMenu: StateSpace<string, UIFragment, void> = {
        metaData: 'login menu',
        subStates: [
            {
                key: PATH.login,
                fragment: () => (loggedIn ? redirectToApp() : <LoginForm splash={splash} />),
            },
            {
                key: PATH.register,
                fragment: () => (loggedIn ? redirectToApp() : <RegistrationForm splash={splash} />),
            },
            {
                key: PATH.forgotPassword,
                fragment: () => (loggedIn ? redirectToApp() : <ForgotPasswordForm splash={splash} />),
            },
            {
                key: PATH.verifyEmail,
                fragment: () => (loggedIn ? redirectToApp() : <span>Should verify email</span>),
            },
            {
                key: PATH.resetPassword,
                fragment: () => (loggedIn ? redirectToApp() : <PasswordResetForm splash={splash} />),
            },
        ],
        fallback: () => (loggedIn ? children : redirect({ to: ['login'], pathSaveArg: redirectArg })),
    };

    return <LocationDependentArea id={'login-menu'} stateSpace={loginMenu} />;
}
