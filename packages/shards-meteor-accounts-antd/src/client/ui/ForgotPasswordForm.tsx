import * as React from 'react';
import { useState } from 'react';
import { ForgotPasswordFormUI, ForgotPasswordFormUIProps } from '@moxb/shards-account-ui-antd';

type ForgotPasswordFormProps = Pick<ForgotPasswordFormUIProps, 'splash'>;

import { loginLink, registerLink } from './links';

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
    const [error, setError] = useState<string | undefined>();
    const [message, setMessage] = useState<string | undefined>();
    const [resetPending, setResetPending] = useState(false);

    return (
        <ForgotPasswordFormUI
            splash={props.splash}
            error={error}
            message={message}
            resetPending={resetPending}
            loginLink={loginLink}
            registerLink={registerLink}
            onReset={({ username }) => {
                setResetPending(true);
                setError(undefined);
                // console.log('Attempting to reset', username);
                Accounts.forgotPassword({ email: username }, (forgotError: any) => {
                    setResetPending(false);
                    if (forgotError) {
                        setError(forgotError.reason || 'Failed to initiate password reset');
                    } else {
                        setMessage('Email sent. Please check your email.');
                    }
                });
            }}
        />
    );
}
