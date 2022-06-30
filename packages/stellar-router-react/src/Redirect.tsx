import * as React from 'react';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { UpdateMethod, NavRef, UrlArg, MyLocation } from '@moxb/stellar-router-core';
import { useLocationManager } from './routingProviders';

interface RedirectProps {
    position?: number;

    /**
     * Where should we go? (List of path tokens.)
     *
     * Either this or location should be given.
     */
    to?: string[];

    updateMethod?: UpdateMethod;

    /**
     * If you want the original path to be saved, provide an UrlArg for that.
     * (Note that the arg should be permanent, in order to survive the path change.)
     */
    pathSaveArg?: UrlArg<MyLocation | null>;

    /**
     * Are we trying to restore a saved location? Then provide that location
     *
     * When supplied, this will override all other values.
     */
    location?: MyLocation;
}

export const Redirect = observer((props: RedirectProps) => {
    const locationManager = useLocationManager('redirect');

    useEffect(() => {
        const { position = 0, to, updateMethod, pathSaveArg, location } = props;
        if (location) {
            locationManager!._doSetLocation(location, UpdateMethod.REPLACE);
            return;
        }
        if (pathSaveArg) {
            pathSaveArg.doSet(locationManager!._location);
        }
        if (to !== undefined) {
            // An empty list is a valid input here, so we can't simply test for falsy
            locationManager!.doSetPathTokens(position, to, updateMethod);
        }
    }, []);

    return <div>Redirecting ... </div>;
});

export const redirect = (props: RedirectProps) => <Redirect {...props} />;

export const redirectTo = (to: string[]) => redirect({ to });

export function redirectToNavRef<InputType>(
    navRef: NavRef<InputType>,
    tokens?: InputType,
    updateMethod?: UpdateMethod
) {
    const link = navRef.createDirectLink(tokens);
    return redirect({
        to: link.pathTokens,
        updateMethod,
    });
}
