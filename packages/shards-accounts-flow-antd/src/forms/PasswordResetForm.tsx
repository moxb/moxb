import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useLocationManager } from '@moxb/stellar-router-react';
import { PasswordResetFormUI, PasswordResetFormUIProps } from '@moxb/shards-accounts-ui-antd';

import { getLinks } from '../links';
import { useAuthBackend } from '../authContext';

type PasswordResetFormProps = Pick<PasswordResetFormUIProps, 'splash'>;

export const PasswordResetForm = observer((props: PasswordResetFormProps) => {
    const { splash } = props;
    const backend = useAuthBackend()!;

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
