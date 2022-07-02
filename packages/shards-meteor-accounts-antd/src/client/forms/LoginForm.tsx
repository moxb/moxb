import * as React from 'react';
import { LoginFormUI, LoginFormUIProps } from '@moxb/shards-account-ui-antd';
import { getLinks } from '../links';
import { AuthBackend } from '../AuthBackend';

type LoginFormProps = Pick<LoginFormUIProps, 'splash'> & { backend: AuthBackend };

export function LoginForm(props: LoginFormProps) {
    const { backend } = props;
    const { loginErrorMessage, isLoginPending } = backend.useLoginStatus();
    const links = getLinks();

    return (
        <LoginFormUI
            splash={props.splash}
            error={loginErrorMessage}
            loginPending={isLoginPending}
            onLogin={({ username, password }) => backend.triggerLogin(username, password)}
            registerLink={links.register}
            forgotPasswordLink={links.forgotPassword}
        />
    );
}
