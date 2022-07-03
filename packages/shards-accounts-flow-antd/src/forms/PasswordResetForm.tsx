import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useLocationManager } from '@moxb/stellar-router-react';
import { PasswordResetFormUI, PasswordResetFormUIProps } from '@moxb/shards-accounts-ui-antd';

import { getLinks } from '../links';
import { useAuthenticationLogic } from '../authContext';
import { useEffect } from 'react';

type PasswordResetFormProps = Pick<PasswordResetFormUIProps, 'splash'>;

export const PasswordResetForm = observer((props: PasswordResetFormProps) => {
    const { splash } = props;
    const auth = useAuthenticationLogic();
    useEffect(() => auth.cleanResetForm(), []);
    const locationManager = useLocationManager('password reset form');
    const token = locationManager?._query.token;
    const links = getLinks();
    return (
        <PasswordResetFormUI
            splash={splash}
            resetPending={auth.isResetPending}
            error={auth.resetErrorMessage}
            onReset={({ password1, password2 }) => auth.triggerPasswordReset(token, password1, password2)}
            loginLink={links.login}
        />
    );
});
