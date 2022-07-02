import * as React from 'react';
import { RegistrationFormUI, RegistrationFormUIProps } from '@moxb/shards-account-ui-antd';

import { getLinks } from '../links';
import { AuthBackend } from '../AuthBackend';

type RegistrationFormProps = Pick<RegistrationFormUIProps, 'splash'> & { backend: AuthBackend };

export function RegistrationForm(props: RegistrationFormProps) {
    const { backend, splash } = props;
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
