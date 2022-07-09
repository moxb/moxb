import { observer } from 'mobx-react-lite';

import { getDebugLogger } from '@moxb/moxb';
import { MyLocation, redirect, UpdateMethod, useLocationManager } from '@moxb/stellar-router-react';

import { useAuthenticationLogic } from './authContext';

interface OnlyUsersProps {
    children: JSX.Element;
    debug?: boolean;
}

export const OnlyUsers = observer((props: OnlyUsersProps): JSX.Element | null => {
    const { children, debug } = props;
    const logger = getDebugLogger('OnlyUsers', debug);

    const auth = useAuthenticationLogic();

    const locationManager = useLocationManager('login required');
    const redirectArg = locationManager.defineObjectArg<MyLocation>('redirectTo', null, true);

    // If the login state is not yet known, we will just wait
    if (!auth.isLoginStatusKnown) {
        logger.log('Auth status unknown, waiting');
        return null;
    }

    // If we are logged in, then we can simply display the normal content.
    if (auth.isLoggedIn) {
        logger.log('Logged in, nothing to do');
        return children;
    }

    // It seems like we are supposed to be logged in, but we aren't. We will have to redirect...
    logger.log('Not logged in, redirecting...');
    return redirect({
        to: ['login'],
        updateMethod: UpdateMethod.REPLACE,
        pathSaveArg: redirectArg,
    });
});
