import { observer } from 'mobx-react-lite';

import { MyLocation, redirect, UpdateMethod, useLocationManager } from '@moxb/stellar-router-react';

import { useAuthenticationLogic } from './authContext';

interface OnlyUsersProps {
    children: JSX.Element;
}

export const OnlyUsers = observer((props: OnlyUsersProps): JSX.Element | null => {
    const { children } = props;

    const auth = useAuthenticationLogic();

    const locationManager = useLocationManager('login required');
    const redirectArg = locationManager.defineObjectArg<MyLocation>('redirectTo', null, true);

    // If the login state is not yet known, we will just wait
    if (!auth.isLoginStatusKnown) {
        return null;
    }

    // If we are logged in, then we can simply display the normal content.
    if (auth.isLoggedIn) {
        return children;
    }

    // It seems like we are supposed to be logged in, but we aren't. We will have to redirect...
    return redirect({
        to: ['login'],
        updateMethod: UpdateMethod.REPLACE,
        pathSaveArg: redirectArg,
    });
});
