import * as React from 'react';

import type { UIFragment } from '@moxb/react-html';
import {
    LocationDependentArea,
    MyLocation,
    redirect,
    StateSpace,
    UpdateMethod,
    useLocationManager,
} from '@moxb/stellar-router-react';

import { LoginForm } from './forms/LoginForm';
import { RegistrationForm } from './forms/RegistrationForm';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm';
import { PasswordResetForm } from './forms/PasswordResetForm';
import { LOGIN_SYSTEM_PATH as PATH } from './paths';
import { AuthenticationLogicProvider } from './authContext';
import { AuthenticationBackend } from './AuthenticationBackend';
import { AuthenticationLogicImpl } from './AuthenticationLogicImpl';
import { AuthenticationLogic } from './AuthenticationLogic';

export interface WithLoginFlowProps {
    children: JSX.Element;
    splash?: UIFragment;
    backend: AuthenticationBackend;
}

/**
 * Wrap this component around your app to provide a login redirection workflow
 */
export function WithLoginFlow(props: WithLoginFlowProps) {
    const { splash, children, backend } = props;

    const locationManager = useLocationManager('login required');
    const redirectArg = locationManager.defineObjectArg<MyLocation>('redirectTo', null, true);

    const redirectToApp = () => {
        const savedRedirect = redirectArg.value;
        return redirect(
            savedRedirect
                ? {
                      location: savedRedirect,
                      updateMethod: UpdateMethod.REPLACE,
                  }
                : {
                      to: [],
                      updateMethod: UpdateMethod.REPLACE,
                  }
        );
    };

    const logic: AuthenticationLogic = new AuthenticationLogicImpl(backend);

    const loginMenu: StateSpace<string, UIFragment, void> = {
        metaData: 'login menu',
        subStates: [
            {
                key: PATH.login,
                fragment: () => (logic.isLoggedIn ? redirectToApp() : <LoginForm splash={splash} />),
            },
            {
                key: PATH.register,
                fragment: () => (logic.isLoggedIn ? redirectToApp() : <RegistrationForm splash={splash} />),
            },
            {
                key: PATH.forgotPassword,
                fragment: () => (logic.isLoggedIn ? redirectToApp() : <ForgotPasswordForm splash={splash} />),
            },
            {
                key: PATH.verifyEmail,
                fragment: () => (logic.isLoggedIn ? redirectToApp() : <span>Should verify email</span>),
            },
            {
                key: PATH.resetPassword,
                fragment: () => (logic.isLoggedIn ? redirectToApp() : <PasswordResetForm splash={splash} />),
            },
        ],
        fallback: () => children,
    };

    return (
        <AuthenticationLogicProvider value={logic}>
            <LocationDependentArea id={'login-menu'} stateSpace={loginMenu} />
        </AuthenticationLogicProvider>
    );
}
