import { MyLocation, redirect, UpdateMethod, useLocationManager } from '@moxb/stellar-router-react';
import { useAuthBackend } from './authContext';

interface OnlyUsersProps {
    children: JSX.Element;
    // TODO: get the backend from the outside, too
}

export function OnlyUsers(props: OnlyUsersProps): JSX.Element | null {
    const { children } = props;

    const backend = useAuthBackend()!;
    const { isLoginStatusKnown, isLoggedIn } = backend.useAuthStatus();

    const locationManager = useLocationManager('login required');
    const redirectArg = locationManager.defineObjectArg<MyLocation>('redirectTo', null, true);

    // If the login state is not yet known, we will just wait
    if (!isLoginStatusKnown) {
        return null;
    }

    // If we are logged in, then we can simply display the normal content.
    if (isLoggedIn) {
        return children;
    }

    // It seems like we are supposed to be logged in, but we aren't. We will have to redirect...
    return redirect({
        to: ['login'],
        updateMethod: UpdateMethod.REPLACE,
        pathSaveArg: redirectArg,
    });
}
