import * as React from 'react';
import { RegistrationFormUI, RegistrationFormUIProps } from '@moxb/shards-accounts-ui-antd';

import { getLinks } from '../links';
import { useAuthBackend } from '../authContext';

type RegistrationFormProps = Pick<RegistrationFormUIProps, 'splash'>;

export function RegistrationForm(props: RegistrationFormProps) {
    const { splash } = props;
    const backend = useAuthBackend();
    const { isRegistrationPending, registrationErrorMessage } = backend.useRegistrationStatus();
    const links = getLinks();
    return (
        <RegistrationFormUI
            splash={splash}
            registrationPending={isRegistrationPending}
            error={registrationErrorMessage}
            onRegister={({ email, password1, password2 }) => backend.triggerRegistration(email, password1, password2)}
            loginLink={links.login}
            forgotPasswordLink={links.forgotPassword}
        />
    );
}
