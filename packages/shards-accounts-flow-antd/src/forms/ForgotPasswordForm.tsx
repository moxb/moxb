import * as React from 'react';
import { ForgotPasswordFormUI, ForgotPasswordFormUIProps } from '@moxb/shards-account-ui-antd';

import { getLinks } from '../links';
import { useAuthBackend } from '../authContext';

type ForgotPasswordFormProps = Pick<ForgotPasswordFormUIProps, 'splash'>;

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
    const backend = useAuthBackend()!;

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
