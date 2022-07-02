import * as React from 'react';
import { LoginFormUI, LoginFormUIProps } from '@moxb/shards-accounts-ui-antd';
import { getLinks } from '../links';
import { useAuthBackend } from '../authContext';

type LoginFormProps = Pick<LoginFormUIProps, 'splash'>;

export function LoginForm(props: LoginFormProps) {
    const backend = useAuthBackend()!;
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
