import * as React from 'react';
import { useState } from 'react';
import { useMeteorLoggingIn } from '/imports/lib/stack/meteor-magic';
import type { LoginFormUIProps } from '/packages/shards-accounts-ui-antd/src/LoginFormUi';
import { LoginFormUI } from '/packages/shards-accounts-ui-antd/src/LoginFormUi';
import { forgotPasswordLink, registerLink } from '/imports/lib/meteor-accounts-ui-antd/client/ui/links';

interface LoginFormProps extends Pick<LoginFormUIProps, 'splash'> {}

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
                Meteor.loginWithPassword(username, password, (error: any) => {
                    setError(error?.reason);
                });
            }}
            registerLink={registerLink}
            forgotPasswordLink={forgotPasswordLink}
        />
    );
}
