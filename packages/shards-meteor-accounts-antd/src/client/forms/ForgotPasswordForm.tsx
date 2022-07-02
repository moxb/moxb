import * as React from 'react';
import { ForgotPasswordFormUI, ForgotPasswordFormUIProps } from '@moxb/shards-account-ui-antd';

type ForgotPasswordFormProps = Pick<ForgotPasswordFormUIProps, 'splash'> & { backend: AuthBackend };

import { getLinks } from '../links';
import { AuthBackend } from '../AuthBackend';

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
    const { backend } = props;

    const { forgotMessage, forgotErrorMessage, isForgotPending } = backend.useForgotStatus();

    const links = getLinks();
    return (
        <ForgotPasswordFormUI
            splash={props.splash}
            error={forgotErrorMessage}
            message={forgotMessage}
            resetPending={isForgotPending}
            loginLink={links.login}
            registerLink={links.register}
            onReset={({ username }) => backend.triggerForgot(username)}
        />
    );
}
