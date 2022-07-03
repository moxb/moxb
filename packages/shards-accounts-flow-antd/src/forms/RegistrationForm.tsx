import * as React from 'react';
import { RegistrationFormUI, RegistrationFormUIProps } from '@moxb/shards-accounts-ui-antd';

import { getLinks } from '../links';
import { useAuthenticationLogic } from '../authContext';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

type RegistrationFormProps = Pick<RegistrationFormUIProps, 'splash'>;

export const RegistrationForm = observer((props: RegistrationFormProps) => {
    const { splash } = props;
    const auth = useAuthenticationLogic();
    useEffect(() => auth.cleanRegistrationForm(), []);
    const links = getLinks();
    return (
        <RegistrationFormUI
            splash={splash}
            registrationPending={auth.isRegistrationPending}
            error={auth.registrationErrorMessage}
            onRegister={({ email, password1, password2 }) => auth.triggerRegistration(email, password1, password2)}
            loginLink={links.login}
            forgotPasswordLink={links.forgotPassword}
        />
    );
});
