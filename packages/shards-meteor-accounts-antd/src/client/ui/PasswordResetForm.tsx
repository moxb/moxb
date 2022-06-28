import * as React from 'react';
import { useState } from 'react';

import { observer } from 'mobx-react-lite';

import { useLocationManager } from '@moxb/stellar-router-react';

import { PasswordResetFormUI, PasswordResetFormUIProps } from '@moxb/shards-account-ui-antd';
import { loginLink } from './links';

type PasswordResetFormProps = Pick<PasswordResetFormUIProps, 'splash'>;

export const PasswordResetForm = observer((props: PasswordResetFormProps) => {
    const { splash } = props;
    const locationManager = useLocationManager('password reset form');
    const token = locationManager?.query.token;
    const [error, setError] = useState<string | undefined>();
    const [pending, setPending] = useState(false);
    return (
        <PasswordResetFormUI
            splash={splash}
            resetPending={pending}
            error={error}
            onReset={({ password1, password2 }) => {
                if (!token) {
                    setError('This link is invalid. Please restart the process.');
                    return;
                }
                if (password1 !== password2) {
                    setError("The two passwords don't match!");
                    return;
                }
                setError(undefined);
                setPending(true);
                Accounts.resetPassword(token, password1, (error: any) => {
                    setPending(false);
                    setError(error?.reason);
                });
            }}
            loginLink={loginLink}
        />
    );
});
