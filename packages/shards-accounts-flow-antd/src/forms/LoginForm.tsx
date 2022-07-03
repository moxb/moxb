import * as React from 'react';
import { LoginFormUI, LoginFormUIProps } from '@moxb/shards-accounts-ui-antd';
import { getLinks } from '../links';
import { useAuthenticationLogic } from '../authContext';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

type LoginFormProps = Pick<LoginFormUIProps, 'splash'>;

export const LoginForm = observer((props: LoginFormProps) => {
    const auth = useAuthenticationLogic();
    const links = getLinks();

    useEffect(() => auth.cleanLoginForm(), []);

    return (
        <LoginFormUI
            splash={props.splash}
            error={auth.loginErrorMessage}
            loginPending={auth.isLoginPending}
            onLogin={({ username, password }) => auth.triggerLogin(username, password)}
            registerLink={links.register}
            forgotPasswordLink={links.forgotPassword}
        />
    );
});
