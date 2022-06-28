import * as React from 'react';
import { useState } from 'react';
import { useMeteorLoggingIn } from '@moxb/meteor-react';
import { LoginFormUI, LoginFormUIProps } from '@moxb/shards-account-ui-antd';
import { forgotPasswordLink, registerLink } from './links';

type LoginFormProps = Pick<LoginFormUIProps, 'splash'>;

export function LoginForm(props: LoginFormProps) {
    const [error, setError] = useState<string | undefined>();
    const loginPending = useMeteorLoggingIn();
    return (
        <LoginFormUI
            splash={props.splash}
            error={error}
            loginPending={loginPending}
            onLogin={({ username, password }) => {
                // console.log('Attempting to log in as', username);
                setError(undefined);
                Meteor.loginWithPassword(username, password, (loginError: any) => {
                    setError(loginError?.reason);
                });
            }}
            registerLink={registerLink}
            forgotPasswordLink={forgotPasswordLink}
        />
    );
}
