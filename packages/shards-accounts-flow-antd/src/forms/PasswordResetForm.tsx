import * as React from 'react';

import { observer } from 'mobx-react-lite';

import { useLocationManager } from '@moxb/stellar-router-react';

import { PasswordResetFormUI, PasswordResetFormUIProps } from '@moxb/shards-account-ui-antd';
import { getLinks } from '../links';
import { AuthBackend } from '../AuthBackend';

type PasswordResetFormProps = Pick<PasswordResetFormUIProps, 'splash'> & { backend: AuthBackend };

export const PasswordResetForm = observer((props: PasswordResetFormProps) => {
    const { splash, backend } = props;
    const locationManager = useLocationManager('password reset form');
    const token = locationManager?._query.token;
    const { resetErrorMessage, isResetPending } = backend.useResetStatus();
    const links = getLinks();
    return (
        <PasswordResetFormUI
            splash={splash}
            resetPending={isResetPending}
            error={resetErrorMessage}
            onReset={({ password1, password2 }) => backend.triggerPasswordReset(token, password1, password2)}
            loginLink={links.login}
        />
    );
});
