import React, { useState } from 'react';
import { loginLink } from '/imports/lib/meteor-accounts-ui-antd/client/ui/links';
import {
    PasswordResetFormUI,
    PasswordResetFormUIProps,
} from '/packages/shards-accounts-ui-antd/src/PasswordResetFormUi';
import { observer } from 'mobx-react-lite';
import { useLocationManager } from '@moxb/stellar-router-react';

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
