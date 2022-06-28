import React, { useState } from 'react';
import type { RegistrationFormUIProps } from '/packages/shards-accounts-ui-antd/src/RegistrationFormUi';
import { RegistrationFormUI } from '/packages/shards-accounts-ui-antd/src/RegistrationFormUi';
import { forgotPasswordLink, loginLink } from '/imports/lib/meteor-accounts-ui-antd/client/ui/links';

interface RegistrationFormProps extends Pick<RegistrationFormUIProps, 'splash'> {}

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
                    (error: any) => {
                        setPending(false);
                        setError(error?.reason);
                    }
                );
            }}
            loginLink={loginLink}
            forgotPasswordLink={forgotPasswordLink}
        />
    );
}
