import React, { useState } from 'react';
import {
    ForgotPasswordFormUI,
    ForgotPasswordFormUIProps,
} from '/packages/shards-accounts-ui-antd/src/ForgotPasswordFormUI';

interface ForgotPasswordFormProps extends Pick<ForgotPasswordFormUIProps, 'splash'> {}

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
            onReset={({ username }) => {
                setResetPending(true);
                setError(undefined);
                // console.log('Attempting to reset', username);
                Accounts.forgotPassword({ email: username }, (error: any) => {
                    setResetPending(false);
                    if (error) {
                        setError(error.reason || 'Failed to initiate password reset');
                    } else {
                        setMessage('Email sent. Please check your email.');
                    }
                });
            }}
        />
    );
}
