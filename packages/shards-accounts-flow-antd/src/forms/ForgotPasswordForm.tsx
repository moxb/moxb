import * as React from 'react';
import { ForgotPasswordFormUI, ForgotPasswordFormUIProps } from '@moxb/shards-accounts-ui-antd';
import { observer } from 'mobx-react-lite';

import { getLinks } from '../links';
import { useAuthenticationLogic } from '../authContext';
import { useEffect } from 'react';

type ForgotPasswordFormProps = Pick<ForgotPasswordFormUIProps, 'splash'>;

export const ForgotPasswordForm = observer((props: ForgotPasswordFormProps) => {
    const auth = useAuthenticationLogic();
    useEffect(() => auth.cleanForgotForm(), []);

    const links = getLinks();
    return (
        <ForgotPasswordFormUI
            splash={props.splash}
            error={auth.forgotErrorMessage}
            message={auth.forgotMessage}
            resetPending={auth.isForgotPending}
            loginLink={links.login}
            registerLink={links.register}
            onReset={({ username }) => auth.triggerForgot(username)}
        />
    );
});
