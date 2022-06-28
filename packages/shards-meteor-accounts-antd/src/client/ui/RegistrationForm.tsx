import * as React from 'react';
import { useState } from 'react';
import { RegistrationFormUI, RegistrationFormUIProps } from '@moxb/shards-account-ui-antd';

import { forgotPasswordLink, loginLink } from './links';

type RegistrationFormProps = Pick<RegistrationFormUIProps, 'splash'>;

export function RegistrationForm(props: RegistrationFormProps) {
    const { splash } = props;
    const [error, setError] = useState<string | undefined>();
    const [pending, setPending] = useState(false);
    return (
        <RegistrationFormUI
            splash={splash}
            registrationPending={pending}
            error={error}
            onRegister={({ email, password1, password2 }) => {
                // console.log('Should register with', email, password1, password2);
                if (password1 !== password2) {
                    setError("The two passwords don't match!");
                    return;
                }
                setError(undefined);
                setPending(true);
                Accounts.createUser(
                    {
                        username: email,
                        email,
                        password: password1,
                    },
                    (createError: any) => {
                        setPending(false);
                        setError(createError?.reason);
                    }
                );
            }}
            loginLink={loginLink}
            forgotPasswordLink={forgotPasswordLink}
        />
    );
}
