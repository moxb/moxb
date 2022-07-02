import * as React from 'react';

import type { UIFragment } from '@moxb/react-html';
import {
    LocationDependentArea,
    MyLocation,
    NavigableUIContent,
    redirect,
    StateSpace,
    UpdateMethod,
    useLocationManager,
} from '@moxb/stellar-router-react';

import { LoginForm } from './forms/LoginForm';
import { RegistrationForm } from './forms/RegistrationForm';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm';
import { PasswordResetForm } from './forms/PasswordResetForm';
import { LOGIN_SYSTEM_PATH as PATH } from '../common/paths';
import { MeteorAuthBackend } from './MeteorAuthBackend';

interface WithLoginFlowProps {
    children: JSX.Element;
    splash?: UIFragment;
    // TODO: get the backend from the outside, too
}

/**
 * Wrap this component around your app to provide a login redirection workflow
 */
export function WithLoginFlow(props: WithLoginFlowProps) {
    const { splash, children } = props;

    const backend = new MeteorAuthBackend();

    const { isLoggedIn } = backend.useAuthStatus();

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

    const loginMenu: StateSpace<string, UIFragment, void> = {
        metaData: 'login menu',
        subStates: [
            {
                key: PATH.login,
                fragment: (p: NavigableUIContent) =>
                    isLoggedIn ? redirectToApp() : <LoginForm splash={splash} {...p} backend={backend} />,
            },
            {
                key: PATH.register,
                fragment: (p: NavigableUIContent) =>
                    isLoggedIn ? redirectToApp() : <RegistrationForm splash={splash} {...p} backend={backend} />,
            },
            {
                key: PATH.forgotPassword,
                fragment: (p: NavigableUIContent) =>
                    isLoggedIn ? redirectToApp() : <ForgotPasswordForm splash={splash} {...p} backend={backend} />,
            },
            {
                key: PATH.verifyEmail,
                fragment: () => (isLoggedIn ? redirectToApp() : <span>Should verify email</span>),
            },
            {
                key: PATH.resetPassword,
                fragment: (p: NavigableUIContent) =>
                    isLoggedIn ? redirectToApp() : <PasswordResetForm splash={splash} {...p} backend={backend} />,
            },
        ],
        fallback: () => children,
    };

    return <LocationDependentArea id={'login-menu'} stateSpace={loginMenu} />;
}
