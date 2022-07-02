import * as React from 'react';
import { ForgotPasswordFormUI, ForgotPasswordFormUIProps } from '@moxb/shards-accounts-ui-antd';
import { observer } from 'mobx-react-lite';

import { getLinks } from '../links';
import { useAuthBackend } from '../authContext';

type ForgotPasswordFormProps = Pick<ForgotPasswordFormUIProps, 'splash'>;

export const ForgotPasswordForm = observer((props: ForgotPasswordFormProps) => {
    const backend = useAuthBackend();

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
});
